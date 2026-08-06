import { Router } from 'express';
import { ensureAptitudeSeedData, ensureUserProgressRows } from '../data/aptitudeSeed.js';
import { ProblemModel } from '../models/Problem.js';
import { TopicModel } from '../models/Topic.js';
import { UserProgressModel } from '../models/UserProgress.js';
import { requireAuth } from '../middleware/auth.js';
import { groqChat, hasGroq } from '../config/groq.js';

export const aptitudeRouter = Router();

aptitudeRouter.use(requireAuth);
aptitudeRouter.use(async (_req, _res, next) => {
  try {
    await ensureAptitudeSeedData();
    next();
  } catch (err) {
    next(err);
  }
});

aptitudeRouter.get('/hub', async (req, res, next) => {
  try {
    await ensureUserProgressRows(req.auth.userId);

    const topics = await TopicModel.find({}).lean();
    const problems = await ProblemModel.find({}, { _id: 1, topicId: 1 }).lean();
    const progressRows = await UserProgressModel.find({ userId: req.auth.userId }).lean();

    const solvedSet = new Set(progressRows.filter((row) => row.isSolved).map((row) => row.problemId.toString()));
    const problemCountByTopic = new Map();
    const solvedCountByTopic = new Map();

    for (const problem of problems) {
      const key = problem.topicId.toString();
      problemCountByTopic.set(key, (problemCountByTopic.get(key) ?? 0) + 1);
      if (solvedSet.has(problem._id.toString())) {
        solvedCountByTopic.set(key, (solvedCountByTopic.get(key) ?? 0) + 1);
      }
    }

    const grouped = { Quant: [], Logical: [], Verbal: [] };
    const categoryAliases = {
      Quant: 'Quant',
      'Quantitative Aptitude': 'Quant',
      Logical: 'Logical',
      'Logical Reasoning': 'Logical',
      Verbal: 'Verbal',
      'Verbal Ability': 'Verbal'
    };

    for (const topic of topics) {
      const total = problemCountByTopic.get(topic._id.toString()) ?? 0;
      const solved = solvedCountByTopic.get(topic._id.toString()) ?? 0;
      const completionPercentage = total === 0 ? 0 : Math.round((solved / total) * 100);

      const normalizedCategory = categoryAliases[String(topic.category || '').trim()];
      if (!normalizedCategory) {
        continue;
      }

      grouped[normalizedCategory].push({
        title: topic.title,
        slug: topic.slug,
        icon: topic.icon,
        completionPercentage
      });
    }

    return res.json({
      success: true,
      data: grouped
    });
  } catch (err) {
    next(err);
  }
});

aptitudeRouter.get('/topic/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const topic = await TopicModel.findOne({ slug }).lean();
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    await ensureUserProgressRows(req.auth.userId);

    const problems = await ProblemModel.find({ topicId: topic._id }).sort({ pattern: 1, createdAt: 1 }).lean();
    const progressRows = await UserProgressModel.find({
      userId: req.auth.userId,
      problemId: { $in: problems.map((problem) => problem._id) }
    }).lean();
    const progressByProblemId = new Map(progressRows.map((row) => [row.problemId.toString(), row]));

    // Build flat problem list
    const problemList = problems.map((problem) => {
      const progress = progressByProblemId.get(problem._id.toString());
      return {
        id: problem._id.toString(),
        title: problem.title,
        questionText: problem.questionText,
        options: problem.options,
        correctOptionIndex: problem.correctAnswerIndex,
        difficulty: problem.difficulty,
        hintText: problem.hintText,
        explanation: problem.detailedSolution,
        pattern: problem.pattern || '',
        isSolved: progress?.isSolved ?? false,
        personalNote: progress?.personalNote ?? ''
      };
    });

    // Group problems by pattern for the frontend
    const patternOrder = [];
    const patternMap = new Map();
    for (const p of problemList) {
      const key = p.pattern || 'General';
      if (!patternMap.has(key)) {
        patternMap.set(key, []);
        patternOrder.push(key);
      }
      patternMap.get(key).push(p);
    }
    const problemsByPattern = patternOrder.map(name => ({
      name,
      problems: patternMap.get(name)
    }));

    return res.json({
      success: true,
      data: {
        title: topic.title,
        slug: topic.slug,
        category: topic.category,
        icon: topic.icon,
        conceptArticle: topic.conceptArticle,
        problemList,          // flat list (kept for backward compat)
        problemsByPattern     // grouped by pattern (new)
      }
    });
  } catch (err) {
    next(err);
  }
});

aptitudeRouter.patch('/update-note', async (req, res, next) => {
  try {
    const { problemId, personalNote } = req.body ?? {};

    if (typeof problemId !== 'string' || !problemId.trim()) {
      return res.status(400).json({ success: false, message: 'problemId is required' });
    }
    if (typeof personalNote !== 'string') {
      return res.status(400).json({ success: false, message: 'personalNote is required' });
    }

    const update = { personalNote };

    const row = await UserProgressModel.findOneAndUpdate(
      { userId: req.auth.userId, problemId },
      { $set: update, $setOnInsert: { isSolved: false } },
      { upsert: true, new: true }
    ).lean();

    return res.json({
      success: true,
      data: {
        problemId: row.problemId.toString(),
        personalNote: row.personalNote,
        isSolved: row.isSolved
      }
    });
  } catch (err) {
    next(err);
  }
});

aptitudeRouter.post('/ai-assistant', async (req, res) => {
  const { problemContext, userQuery } = req.body ?? {};

  if (!problemContext || typeof problemContext !== 'object') {
    return res.status(400).json({ success: false, message: 'problemContext is required' });
  }
  if (typeof userQuery !== 'string' || !userQuery.trim()) {
    return res.status(400).json({ success: false, message: 'userQuery is required' });
  }

  const fallbackHint =
    `Think in steps: first identify what the question asks, then connect with this hint: ` +
    `${problemContext.hintText || 'Break the problem into smaller conditions.'} ` +
    `Avoid jumping to final answer immediately.`;

  if (!hasGroq()) {
    return res.json({
      success: true,
      data: {
        hint: fallbackHint,
        source: 'local-fallback'
      }
    });
  }

  const systemInstruction =
    'You are the SP3 Neural Assistant — a helpful, conversational aptitude tutor. ' +
    'Answer the student\'s question naturally and helpfully, just like a knowledgeable friend would. ' +
    'If they ask for the answer, give it clearly along with a full explanation of the logic. ' +
    'If they ask for a hint, give a helpful hint. If they ask a concept question, explain it well. ' +
    'Be friendly, clear, and thorough. Use step-by-step reasoning when solving math problems.';

  const prompt = [
    'Problem Text:',
    String(problemContext.questionText || ''),
    '',
    'Options:',
    Array.isArray(problemContext.options) ? problemContext.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n') : '(no options provided)',
    '',
    'Hint available:',
    String(problemContext.hintText || ''),
    '',
    'Student asks:',
    userQuery.trim()
  ].join('\n');

  try {
    const hint = await groqChat(systemInstruction, prompt, { temperature: 0.7, maxTokens: 600 }) || fallbackHint;

    return res.json({
      success: true,
      data: {
        hint,
        source: 'groq'
      }
    });
  } catch (err) {
    console.error('[Groq error]', err?.message || err);
    return res.json({
      success: true,
      data: {
        hint: fallbackHint,
        source: 'local-fallback'
      }
    });
  }
});

aptitudeRouter.post('/submit-problem', async (req, res, next) => {
  try {
    const { problemId, selectedOptionIndex } = req.body ?? {};

    if (typeof problemId !== 'string' || !problemId.trim()) {
      return res.status(400).json({ success: false, message: 'problemId is required' });
    }
    if (typeof selectedOptionIndex !== 'number') {
      return res.status(400).json({ success: false, message: 'selectedOptionIndex is required' });
    }

    const problem = await ProblemModel.findById(problemId).lean();
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const isCorrect = selectedOptionIndex === problem.correctAnswerIndex;

    // Auto-solved mode: only the backend can mark a problem as solved.
    // IMPORTANT: MongoDB does not allow updating the same path in both $set and $setOnInsert.
    if (isCorrect) {
      await UserProgressModel.updateOne(
        { userId: req.auth.userId, problemId },
        { $set: { isSolved: true }, $setOnInsert: { personalNote: '' } },
        { upsert: true }
      );
    } else {
      // Incorrect attempt should not unset an already-solved problem.
      await UserProgressModel.updateOne(
        { userId: req.auth.userId, problemId },
        { $setOnInsert: { isSolved: false, personalNote: '' } },
        { upsert: true }
      );
    }

    return res.json({
      success: true,
      data: {
        isCorrect,
        correctAnswerIndex: problem.correctAnswerIndex,
        explanation: problem.detailedSolution,
        detailedSolution: problem.detailedSolution
      }
    });
  } catch (err) {
    next(err);
  }
});