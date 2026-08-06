import { Router } from 'express';
import { groqChat, hasGroq } from '../config/groq.js';
import { ensureCoreSubjectsSeedData, ensureCoreUserProgressRows } from '../data/coreSubjectsSeed.js';
import { requireAuth } from '../middleware/auth.js';
import { ProblemModel } from '../models/Problem.js';
import { TopicModel } from '../models/Topic.js';
import { UserProgressModel } from '../models/UserProgress.js';


const coreCategoryOrder = ['OS', 'DBMS', 'CN', 'OOPS'];

export const coreSubjectsRouter = Router();

coreSubjectsRouter.use(requireAuth);
coreSubjectsRouter.use(async (_req, _res, next) => {
  try {
    await ensureCoreSubjectsSeedData();
    next();
  } catch (err) {
    next(err);
  }
});

coreSubjectsRouter.get('/hub', async (req, res, next) => {
  try {
    await ensureCoreUserProgressRows(req.auth.userId);

    const topics = await TopicModel.find({ category: { $in: coreCategoryOrder } }).lean();
    const problems = await ProblemModel.find({ topicId: { $in: topics.map((topic) => topic._id) } }, { _id: 1, topicId: 1 }).lean();
    const progressRows = await UserProgressModel.find({
      userId: req.auth.userId,
      problemId: { $in: problems.map((problem) => problem._id) }
    }).lean();

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

    const grouped = { OS: [], DBMS: [], CN: [], OOPS: [] };
    for (const topic of topics) {
      const total = problemCountByTopic.get(topic._id.toString()) ?? 0;
      const solved = solvedCountByTopic.get(topic._id.toString()) ?? 0;
      const completionPercentage = total === 0 ? 0 : Math.round((solved / total) * 100);

      grouped[topic.category].push({
        title: topic.title,
        slug: topic.slug,
        icon: topic.icon,
        completionPercentage
      });
    }

    return res.json({ success: true, data: grouped });
  } catch (err) {
    next(err);
  }
});

coreSubjectsRouter.get('/topic/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const topic = await TopicModel.findOne({ slug, category: { $in: coreCategoryOrder } }).lean();
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    await ensureCoreUserProgressRows(req.auth.userId);

    const problems = await ProblemModel.find({ topicId: topic._id }).sort({ createdAt: 1 }).lean();
    const progressRows = await UserProgressModel.find({
      userId: req.auth.userId,
      problemId: { $in: problems.map((problem) => problem._id) }
    }).lean();
    const progressByProblemId = new Map(progressRows.map((row) => [row.problemId.toString(), row]));

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
        detailedSolution: problem.detailedSolution,
        pattern: problem.pattern || 'General',
        isSolved: progress?.isSolved ?? false,
        personalNote: progress?.personalNote ?? ''
      };
    });

    // Group by pattern
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
        problemList,
        problemsByPattern
      }
    });
  } catch (err) {
    next(err);
  }
});

coreSubjectsRouter.patch('/update-note', async (req, res, next) => {
  try {
    const { problemId, personalNote } = req.body ?? {};

    if (typeof problemId !== 'string' || !problemId.trim()) {
      return res.status(400).json({ success: false, message: 'problemId is required' });
    }
    if (typeof personalNote !== 'string') {
      return res.status(400).json({ success: false, message: 'personalNote is required' });
    }

    const row = await UserProgressModel.findOneAndUpdate(
      { userId: req.auth.userId, problemId },
      { $set: { personalNote }, $setOnInsert: { isSolved: false } },
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

coreSubjectsRouter.post('/ai-assistant', async (req, res, next) => {
  try {
    const { problemContext, userQuery } = req.body ?? {};

    if (!problemContext || typeof problemContext !== 'object') {
      return res.status(400).json({ success: false, message: 'problemContext is required' });
    }
    if (typeof userQuery !== 'string' || !userQuery.trim()) {
      return res.status(400).json({ success: false, message: 'userQuery is required' });
    }

    const fallbackHint =
      'Focus on the underlying concept first, then connect it to this prompt: ' +
      `${problemContext.hintText || 'State the definition and contrast it with a nearby concept.'}`;

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
      'You are the SP3 Neural Assistant — a helpful, conversational tutor for core CS subjects (OS, DBMS, CN, OOPS). ' +
      'Answer the student\'s question naturally and helpfully like a knowledgeable friend would. ' +
      'If they ask for the answer, give it clearly along with a conceptual explanation. ' +
      'If they want a hint, give a good hint. Explain concepts with simple analogies when helpful. ' +
      'Be friendly, thorough, and interview-focused.';

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
  } catch (err) {
    next(err);
  }
});

coreSubjectsRouter.post('/submit-problem', async (req, res, next) => {
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

    const topic = await TopicModel.findById(problem.topicId).lean();
    if (!topic || !coreCategoryOrder.includes(topic.category)) {
      return res.status(400).json({ success: false, message: 'Problem is not part of core subjects module' });
    }

    const isCorrect = selectedOptionIndex === problem.correctAnswerIndex;

    if (isCorrect) {
      await UserProgressModel.updateOne(
        { userId: req.auth.userId, problemId },
        { $set: { isSolved: true }, $setOnInsert: { personalNote: '' } },
        { upsert: true }
      );
    } else {
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