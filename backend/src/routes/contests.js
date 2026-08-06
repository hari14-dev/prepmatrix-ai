/**
 * contests.js  —  Practice Contests API
 *
 * Routes:
 *  GET  /api/contests/list          — all contests with user's best attempt info
 *  GET  /api/contests/:id           — single contest details (questions without correct answers)
 *  POST /api/contests/:id/start     — start or resume an attempt
 *  POST /api/contests/:id/submit    — submit answers, get scored result
 *  GET  /api/contests/:id/result    — fetch result of a completed attempt
 */
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { ContestModel } from '../models/Contest.js';
import { ContestAttemptModel } from '../models/ContestAttempt.js';
import { ensureContestSeedData } from '../data/contestSeed.js';

export const contestsRouter = Router();
contestsRouter.use(requireAuth);

// Seed contests on first request
contestsRouter.use(async (_req, _res, next) => {
  try {
    await ensureContestSeedData();
    next();
  } catch (err) {
    next(err);
  }
});

/* ── GET /list ──────────────────────────────────────────── */
contestsRouter.get('/list', async (req, res, next) => {
  try {
    const contests = await ContestModel.find({ isActive: true })
      .select('title description company difficulty timeLimit questions')
      .lean();

    // Fetch this user's best attempts for all contests
    const attempts = await ContestAttemptModel.find({
      userId: req.auth.userId,
      status: { $in: ['submitted', 'timed-out'] },
    }).lean();

    const attemptByContest = new Map(
      attempts.map(a => [a.contestId.toString(), a])
    );

    const list = contests.map(c => {
      const attempt = attemptByContest.get(c._id.toString());
      return {
        id:          c._id.toString(),
        title:       c.title,
        description: c.description,
        company:     c.company,
        difficulty:  c.difficulty,
        timeLimit:   c.timeLimit,
        questionCount: c.questions.length,
        // Scoring: +10 per correct, 0 per wrong
        maxScore:    c.questions.length * 10,
        // User's progress
        bestScore:   attempt?.score ?? null,
        attempted:   !!attempt,
        status:      attempt?.status ?? 'not-started',
      };
    });

    return res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

/* ── GET /:id ───────────────────────────────────────────── */
// Returns questions WITHOUT correctAnswerIndex (anti-cheat)
contestsRouter.get('/:id', async (req, res, next) => {
  try {
    const contest = await ContestModel.findById(req.params.id).lean();
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    // Check if user has an in-progress attempt (for resume)
    const existing = await ContestAttemptModel.findOne({
      userId: req.auth.userId,
      contestId: contest._id,
    }).lean();

    // Strip correct answers and explanations from questions
    const safeQuestions = contest.questions.map(q => ({
      id:           q._id.toString(),
      type:         q.type,
      module:       q.module,
      topic:        q.topic,
      difficulty:   q.difficulty,
      questionText: q.questionText,
      options:      q.options,
      // No correctAnswerIndex or explanation here
    }));

    return res.json({
      success: true,
      data: {
        id:           contest._id.toString(),
        title:        contest.title,
        description:  contest.description,
        company:      contest.company,
        difficulty:   contest.difficulty,
        timeLimit:    contest.timeLimit,
        questions:    safeQuestions,
        // Attempt info for resuming
        attemptStatus:  existing?.status ?? 'not-started',
        startedAt:      existing?.startedAt ?? null,
        savedAnswers:   existing?.status === 'in-progress'
          ? existing.answers.map(a => ({
              questionId:          a.questionId.toString(),
              selectedAnswerIndex: a.selectedAnswerIndex,
            }))
          : [],
      },
    });
  } catch (err) {
    next(err);
  }
});

/* ── POST /:id/start ────────────────────────────────────── */
// Resumes an in-progress attempt, or starts a fresh one (including retries
// of an already-completed contest — resets that single attempt document).
contestsRouter.post('/:id/start', async (req, res, next) => {
  try {
    const contest = await ContestModel.findById(req.params.id).lean();
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    // There is at most ONE attempt document per (userId, contestId) — unique index.
    let attempt = await ContestAttemptModel.findOne({
      userId: req.auth.userId,
      contestId: contest._id,
    });

    if (!attempt) {
      // First ever attempt — create it. Guard against a race: if two
      // requests land here at the same instant (e.g. a double-fired
      // request from the client), only one insert can win the unique
      // index — the loser re-fetches instead of crashing.
      try {
        attempt = await ContestAttemptModel.create({
          userId:     req.auth.userId,
          contestId:  contest._id,
          status:     'in-progress',
          startedAt:  new Date(),
          answers:    [],
          score:      0,
          totalMarks: contest.questions.length * 10,
        });
      } catch (err) {
        if (err?.code === 11000) {
          attempt = await ContestAttemptModel.findOne({
            userId: req.auth.userId,
            contestId: contest._id,
          });
        } else {
          throw err;
        }
      }
    } else if (attempt.status !== 'in-progress') {
      // Previous attempt was submitted/timed-out — this is a retry.
      // Reset the SAME document instead of inserting a new one
      // (a second document would violate the unique userId+contestId index).
      attempt.status      = 'in-progress';
      attempt.startedAt   = new Date();
      attempt.submittedAt = undefined;
      attempt.answers     = [];
      attempt.score       = 0;
      attempt.totalMarks  = contest.questions.length * 10;
      await attempt.save();
    }
    // else: attempt is already in-progress → just resume it as-is.

    return res.json({
      success: true,
      data: {
        attemptId:  attempt._id.toString(),
        startedAt:  attempt.startedAt,
        timeLimit:  contest.timeLimit,
      },
    });
  } catch (err) {
    next(err);
  }
});

/* ── POST /:id/submit ───────────────────────────────────── */
// answers: [{ questionId, selectedAnswerIndex }]
contestsRouter.post('/:id/submit', async (req, res, next) => {
  try {
    const { answers = [] } = req.body;

    const contest = await ContestModel.findById(req.params.id).lean();
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }
    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'answers must be an array' });
    }

    // Build a map of correct answers
    const correctMap = new Map(
      contest.questions.map(q => [q._id.toString(), q.correctAnswerIndex])
    );

    // Score each answer (skip malformed entries instead of crashing on them)
    let score = 0;
    const scoredAnswers = answers
      .filter(a => a && a.questionId != null)
      .map(a => {
        const correct   = correctMap.get(String(a.questionId));
        const isCorrect = correct !== undefined && a.selectedAnswerIndex === correct;
        if (isCorrect) score += 10;
        return {
          questionId:          a.questionId,
          selectedAnswerIndex: a.selectedAnswerIndex,
          isCorrect,
        };
      });

    // Upsert the attempt as submitted (this is safe even without a prior
    // /start call, and safe on a retry — same doc, matched by userId+contestId).
    // Guard against a race: MongoDB upserts can still throw a duplicate-key
    // error if two requests for the same new attempt land at the same
    // instant (e.g. a double-fired submit from the client). If that
    // happens, the document now exists, so retry as a plain (non-upsert)
    // update instead of failing the whole submission.
    const submitUpdate = {
      $set: {
        status:      'submitted',
        submittedAt: new Date(),
        answers:     scoredAnswers,
        score,
        totalMarks:  contest.questions.length * 10,
      },
    };

    let attempt;
    try {
      attempt = await ContestAttemptModel.findOneAndUpdate(
        { userId: req.auth.userId, contestId: contest._id },
        { ...submitUpdate, $setOnInsert: { startedAt: new Date() } },
        { upsert: true, new: true }
      );
    } catch (err) {
      if (err?.code === 11000) {
        attempt = await ContestAttemptModel.findOneAndUpdate(
          { userId: req.auth.userId, contestId: contest._id },
          submitUpdate,
          { new: true }
        );
      } else {
        throw err;
      }
    }

    // Build the full result with questions + correct answers + explanations
    const resultQuestions = contest.questions.map(q => {
      const userAnswer = scoredAnswers.find(
        a => String(a.questionId) === q._id.toString()
      );
      return {
        id:                  q._id.toString(),
        type:                q.type,
        module:              q.module,
        topic:               q.topic,
        difficulty:          q.difficulty,
        questionText:        q.questionText,
        options:             q.options,
        correctAnswerIndex:  q.correctAnswerIndex,
        explanation:         q.explanation || '',
        selectedAnswerIndex: userAnswer?.selectedAnswerIndex ?? -1,
        isCorrect:           userAnswer?.isCorrect ?? false,
      };
    });

    return res.json({
      success: true,
      data: {
        score,
        totalMarks:  contest.questions.length * 10,
        percentage:  Math.round((score / (contest.questions.length * 10)) * 100),
        timeTaken:   attempt.startedAt
          ? Math.round((Date.now() - new Date(attempt.startedAt).getTime()) / 1000)
          : 0,
        questions: resultQuestions,
      },
    });
  } catch (err) {
    next(err);
  }
});

/* ── GET /:id/result ────────────────────────────────────── */
// Fetch the stored result of a completed attempt
contestsRouter.get('/:id/result', async (req, res, next) => {
  try {
    const contest = await ContestModel.findById(req.params.id).lean();
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    const attempt = await ContestAttemptModel.findOne({
      userId:    req.auth.userId,
      contestId: contest._id,
      status:    { $in: ['submitted', 'timed-out'] },
    }).lean();

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'No completed attempt found' });
    }

    const answerMap = new Map(
      attempt.answers.map(a => [a.questionId.toString(), a])
    );

    const resultQuestions = contest.questions.map(q => {
      const ans = answerMap.get(q._id.toString());
      return {
        id:                  q._id.toString(),
        module:              q.module,
        topic:               q.topic,
        difficulty:          q.difficulty,
        questionText:        q.questionText,
        options:             q.options,
        correctAnswerIndex:  q.correctAnswerIndex,
        explanation:         q.explanation || '',
        selectedAnswerIndex: ans?.selectedAnswerIndex ?? -1,
        isCorrect:           ans?.isCorrect ?? false,
      };
    });

    return res.json({
      success: true,
      data: {
        score:      attempt.score,
        totalMarks: attempt.totalMarks,
        percentage: attempt.totalMarks > 0
          ? Math.round((attempt.score / attempt.totalMarks) * 100)
          : 0,
        submittedAt: attempt.submittedAt,
        questions:  resultQuestions,
      },
    });
  } catch (err) {
    next(err);
  }
});