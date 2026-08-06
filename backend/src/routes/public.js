import { Router } from 'express';
import { TopicModel } from '../models/Topic.js';
import { ProblemModel } from '../models/Problem.js';
import { DSAProblemModel } from '../models/DSAProblem.js';

export const publicRouter = Router();

const APTITUDE_CATEGORIES = ['Quant', 'Logical', 'Verbal'];
const CORE_SUBJECT_CATEGORIES = ['OS', 'DBMS', 'CN', 'OOPS'];

/**
 * GET /api/public/stats
 * Unauthenticated, read-only counts used by the marketing landing page.
 * Every number here is a live count from the database — never hardcoded —
 * so the landing page can't drift out of sync with what the platform
 * actually contains.
 */
publicRouter.get('/stats', async (_req, res, next) => {
  try {
    const [aptitudeTopicIds, coreTopicIds, dsaProblems, totalTopics] = await Promise.all([
      TopicModel.find({ category: { $in: APTITUDE_CATEGORIES } }, { _id: 1 }).distinct('_id'),
      TopicModel.find({ category: { $in: CORE_SUBJECT_CATEGORIES } }, { _id: 1 }).distinct('_id'),
      DSAProblemModel.countDocuments({}),
      TopicModel.countDocuments({})
    ]);

    const [aptitudeProblems, coreMcqs] = await Promise.all([
      ProblemModel.countDocuments({ topicId: { $in: aptitudeTopicIds } }),
      ProblemModel.countDocuments({ topicId: { $in: coreTopicIds } })
    ]);

    res.json({
      success: true,
      data: {
        topicsCovered: totalTopics,
        dsaProblems,
        mcqBank: aptitudeProblems + coreMcqs,
        aiFeatures: 4
      }
    });
  } catch (err) {
    next(err);
  }
});
