import { Router } from 'express';
import { groqChat, hasGroq } from '../config/groq.js';
import { env } from '../config/env.js';
import { handleSubmitRequest } from '../controllers/submissionController.js';
import { ensureDSASeedData } from '../data/dsaSeed.js';
import { requireAuth } from '../middleware/auth.js';
import { DSAProblemModel } from '../models/DSAProblem.js';
import { DSAUserProgressModel } from '../models/DSAUserProgress.js';
import { UserSubmissionModel } from '../models/UserSubmission.js';


export const dsaRouter = Router();

function normalizeSlug(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function resolvePatternSlug(slug) {
  const targetSlug = normalizeSlug(slug);
  if (!targetSlug) {
    return '';
  }

  const patterns = await DSAProblemModel.distinct('pattern');
  return patterns.find((pattern) => normalizeSlug(pattern) === targetSlug) ?? '';
}

async function loadPatternSheet(req, pattern) {
  const problems = await DSAProblemModel.find({ pattern }).sort({ createdAt: 1 }).lean();
  const [acceptedRows, noteRows] = await Promise.all([
    UserSubmissionModel.find({
      userId: req.auth.userId,
      problemId: { $in: problems.map((problem) => problem._id) },
      status: 'Accepted'
    }).lean(),
    DSAUserProgressModel.find({
      userId: req.auth.userId,
      problemId: { $in: problems.map((problem) => problem._id) }
    }).lean()
  ]);

  const acceptedSet = new Set(acceptedRows.map((row) => row.problemId.toString()));
  const noteByProblemId = new Map(noteRows.map((row) => [row.problemId.toString(), row.personalNote ?? '']));

  return {
    title: pattern,
    slug: normalizeSlug(pattern),
    pattern,
    problems: problems.map((problem) => ({
      id: problem._id.toString(),
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      isSolved: acceptedSet.has(problem._id.toString()),
      personalNote: noteByProblemId.get(problem._id.toString()) ?? ''
    }))
  };
}

dsaRouter.use(requireAuth);
dsaRouter.use(async (_req, _res, next) => {
  try {
    await ensureDSASeedData();
    next();
  } catch (err) {
    next(err);
  }
});

// GET /api/dsa/problem/:problemId/submissions — Return past submissions for user & problem
dsaRouter.get('/problem/:problemId/submissions', requireAuth, async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.auth.userId;

    let targetId = problemId;
    // If problemId is not a valid ObjectId (e.g. it's a slug like 'array-sum'), find the problem _id
    if (!problemId.match(/^[0-9a-fA-F]{24}$/)) {
      const foundProblem = await DSAProblemModel.findOne({ slug: problemId }, { _id: 1 }).lean();
      if (foundProblem) {
        targetId = foundProblem._id;
      }
    }

    const submissions = await UserSubmissionModel.find({ userId, problemId: targetId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.json({
      success: true,
      data: submissions.map(s => ({
        id: s._id.toString(),
        language: s.language,
        code: s.code,
        status: s.status === 'Accepted' ? 'Accepted' : s.status === 'Runtime' ? 'Runtime Error' : s.status === 'Wrong' ? 'Wrong Answer' : (s.status || 'Evaluated'),
        runtime: s.runtime ?? 0,
        createdAt: s.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
});


// ── GET /api/dsa/concept/:slug ─────────────────────────────────────
// Returns the concept article for a DSA pattern.
// Falls back to a generated placeholder when no article is in the DB.
dsaRouter.get('/concept/:slug', async (req, res, next) => {
  try {
    const pattern = await resolvePatternSlug(req.params.slug);

    if (!pattern) {
      return res.status(404).json({ success: false, message: 'Pattern not found' });
    }

    // Check if the pattern has a concept article stored in DSAProblemModel
    // (we store conceptArticle on the pattern level via a separate collection or on the first problem)
    // For now, generate a high-quality article via Groq if available, else return null
    const fallbackArticle = null; // frontend shows "coming soon" card

    if (!hasGroq()) {
      return res.json({
        success: true,
        data: { pattern, conceptArticle: fallbackArticle }
      });
    }

    const prompt = [
      `Write a detailed concept guide for the DSA pattern: "${pattern}".`,
      'Format as markdown with ## sections. Include:',
      '## Quick Summary (2-3 sentences)',
      '## Core Idea (when and why to use this pattern)',
      '## How It Works (step-by-step walkthrough)',
      '## Template / Code Skeleton (pseudocode or C++ snippet)',
      '## Key Variations',
      '## Time and Space Complexity',
      '## Common Mistakes',
      '## Interview Tips',
      'Write clearly for a student preparing for campus placements.',
      'Keep each section concise but complete. Total length: ~600 words.'
    ].join('\n');

    try {
      const conceptText = await groqChat(
        'You are a technical educator writing DSA concept articles for campus placement students.',
        prompt,
        { temperature: 0.3, maxTokens: 1200 }
      );
      return res.json({
        success: true,
        data: { pattern, conceptArticle: conceptText || fallbackArticle }
      });
    } catch {
      return res.json({
        success: true,
        data: { pattern, conceptArticle: fallbackArticle }
      });
    }
  } catch (err) {
    next(err);
  }
});

dsaRouter.get('/patterns', async (req, res, next) => {
  try {
    const patterns = await DSAProblemModel.distinct('pattern');
    const problems = await DSAProblemModel.find({}, { _id: 1, pattern: 1 }).lean();
    const acceptedRows = await UserSubmissionModel.find({
      userId: req.auth.userId,
      status: 'Accepted'
    }).lean();

    const acceptedProblemSet = new Set(acceptedRows.map((row) => row.problemId.toString()));
    const totals = new Map();
    const solved = new Map();

    for (const problem of problems) {
      const key = problem.pattern;
      totals.set(key, (totals.get(key) ?? 0) + 1);
      if (acceptedProblemSet.has(problem._id.toString())) {
        solved.set(key, (solved.get(key) ?? 0) + 1);
      }
    }

    const data = patterns
      .slice()
      .sort((a, b) => a.localeCompare(b))
      .map((pattern) => {
        const total = totals.get(pattern) ?? 0;
        const solvedCount = solved.get(pattern) ?? 0;
        const masteryPercentage = total === 0 ? 0 : Math.round((solvedCount / total) * 100);
        return {
          pattern,
          masteryPercentage,
          solvedCount,
          totalCount: total
        };
      });

    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

dsaRouter.get('/problems/:pattern', async (req, res, next) => {
  try {
    const pattern = String(req.params.pattern || '').trim();
    if (!pattern) {
      return res.status(400).json({ success: false, message: 'pattern is required' });
    }

    const data = await loadPatternSheet(req, pattern);

    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

dsaRouter.get('/topic/:slug', async (req, res, next) => {
  try {
    const pattern = await resolvePatternSlug(req.params.slug);

    if (!pattern) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const data = await loadPatternSheet(req, pattern);
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

dsaRouter.patch('/update-note', async (req, res, next) => {
  try {
    const { problemId, personalNote } = req.body ?? {};

    if (typeof problemId !== 'string' || !problemId.trim()) {
      return res.status(400).json({ success: false, message: 'problemId is required' });
    }
    if (typeof personalNote !== 'string') {
      return res.status(400).json({ success: false, message: 'personalNote is required' });
    }

    const row = await DSAUserProgressModel.findOneAndUpdate(
      { userId: req.auth.userId, problemId },
      { $set: { personalNote } },
      { upsert: true, new: true }
    ).lean();

    return res.json({
      success: true,
      data: {
        problemId: row.problemId.toString(),
        personalNote: row.personalNote
      }
    });
  } catch (err) {
    next(err);
  }
});

dsaRouter.get('/problem/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const problem = await DSAProblemModel.findOne({ slug }).lean();

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const publicTestCases = (Array.isArray(problem.testCases) ? problem.testCases : []).filter((test) =>
      typeof test.isPublic === 'boolean' ? test.isPublic : !test.isHidden
    );

    return res.json({
      success: true,
      data: {
        id: problem._id.toString(),
        title: problem.title,
        slug: problem.slug,
        topic: problem.topic,
        pattern: problem.pattern,
        difficulty: problem.difficulty,
        description: problem.description,
        constraints: problem.constraints,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        sampleInput: problem.sampleInput || '',
        sampleOutput: problem.sampleOutput || '',
        hintText: problem.hintText,
        starterCode: problem.starterCode,
        testCases: publicTestCases.map((test) => ({
          input: String(test.input ?? ''),
          expectedOutput: String(test.expectedOutput ?? ''),
          explanation: String(test.explanation ?? ''),
          isPublic: true,
          isHidden: false
        })),
        totalTestCaseCount: Array.isArray(problem.testCases) ? problem.testCases.length : 0
      }
    });
  } catch (err) {
    next(err);
  }
});

dsaRouter.post('/submit', handleSubmitRequest);

const oneCompilerLanguageMap = {
  cpp: 'cpp',
  java: 'java',
  python: 'python3',
  python3: 'python3',
  javascript: 'nodejs',
  nodejs: 'nodejs'
};

const terminalStatuses = new Set([
  'Accepted',
  'Wrong Answer',
  'Time Limit Exceeded',
  'Runtime Error',
  'Compilation Error'
]);

function resolveFileName(language) {
  if (language === 'cpp') {
    return 'main.cpp';
  }
  if (language === 'java') {
    return 'Main.java';
  }
  if (language === 'python' || language === 'python3') {
    return 'main.py';
  }
  return 'main.js';
}

async function oneCompilerRequest(path, options = {}) {
  if (!env.ONECOMPILER_RAPIDAPI_KEY) {
    throw new Error('ONECOMPILER_RAPIDAPI_KEY is missing');
  }

  const url = `${env.ONECOMPILER_API_URL}${path}`;
  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': env.ONECOMPILER_RAPIDAPI_KEY,
      'X-RapidAPI-Host': env.ONECOMPILER_RAPIDAPI_HOST
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `OneCompiler request failed (${response.status})`);
  }
  return payload;
}

const normalizeOutput = (value) =>
  String(value ?? '')
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim().replace(/[ \t]+/g, ' '))
    .join('\n')
    .trim();

function compareOutputs(actual, expected) {
  return normalizeOutput(actual) === normalizeOutput(expected);
}

function classifyRunStatus(stderrText, timeSeconds) {
  const stderr = String(stderrText || '').toLowerCase();
  if (stderr.includes('time limit') || Number(timeSeconds || 0) >= 5) {
    return 'Time Limit Exceeded';
  }
  if (stderr) {
    return 'Runtime Error';
  }
  return 'Accepted';
}

async function runOneCompiler({ language, userCode, userStdin }) {
  const result = await oneCompilerRequest('/api/v1/run', {
    method: 'POST',
    body: {
      language: oneCompilerLanguageMap[language],
      files: [{ name: resolveFileName(language), content: userCode }],
      stdin: String(userStdin ?? '')
    }
  });

  const stdout = normalizeOutput(result?.stdout);
  const stderr = normalizeOutput(result?.stderr || result?.error);
  const compileOutput = stderr;
  const time = Number(result?.executionTime || 0) / 1000;
  const status = classifyRunStatus(stderr, time);
  const efficiencyScore = Math.max(1, Math.min(100, Math.round(100 - (time * 20))));

  return { stdout, stderr, compileOutput, time, status, efficiencyScore };
}

function isPublicTestCase(testCase) {
  if (!testCase || typeof testCase !== 'object') {
    return false;
  }
  if (typeof testCase.isPublic === 'boolean') {
    return testCase.isPublic;
  }
  return !testCase.isHidden;
}

dsaRouter.post('/execute', async (req, res) => {
  const { userCode, language, userStdin = '', useCustomInput = true, problemId = '' } = req.body ?? {};
  if (typeof userCode !== 'string') {
    return res.status(400).json({ success: false, message: 'userCode is required' });
  }
  if (!oneCompilerLanguageMap[language]) {
    return res.status(400).json({ success: false, message: 'language is invalid' });
  }

  try {
    let stdinToRun = String(userStdin ?? '');
    let expectedOutput = '';
    let totalCases = 1;
    let results = [];

    if (!useCustomInput) {
      if (typeof problemId !== 'string' || !problemId.trim()) {
        return res.status(400).json({ success: false, message: 'problemId is required when Use Custom Input is off' });
      }
      const problem = await DSAProblemModel.findById(problemId, { testCases: 1 }).lean();
      if (!problem) {
        return res.status(404).json({ success: false, message: 'Problem not found' });
      }
      const sampleCases = (Array.isArray(problem.testCases) ? problem.testCases : []).filter(isPublicTestCase);
      if (sampleCases.length === 0) {
        return res.status(400).json({ success: false, message: 'No test cases configured for problem' });
      }

      totalCases = sampleCases.length;
      let totalPassed = 0;
      let totalTime = 0;
      let terminalStatus = null;

      for (const [index, testCase] of sampleCases.entries()) {
        const caseNumber = index + 1;
        const input = String(testCase.input ?? '');
        const expected = String(testCase.expectedOutput ?? '');
        const run = await runOneCompiler({ language, userCode, userStdin: input });
        totalTime += Number(run.time || 0);

        if (run.status !== 'Accepted') {
          terminalStatus = run.status;
        }

        const passed = run.status === 'Accepted' && compareOutputs(run.stdout, expected);
        if (passed) {
          totalPassed += 1;
        }

        results.push({
          caseNumber,
          passed,
          status: run.status === 'Accepted' ? (passed ? 'Accepted' : 'Wrong Answer') : run.status,
          visibility: 'public',
          input,
          expectedOutput: expected,
          actualOutput: run.stdout,
          compile_output: run.compileOutput
        });
      }

      const overallStatus = terminalStatus
        ? terminalStatus
        : totalPassed === totalCases
          ? 'Accepted'
          : 'Wrong Answer';

      return res.json({
        success: true,
        data: {
          stdout: results.map((row) => row.actualOutput).join('\n'),
          time: totalTime,
          memory: null,
          efficiencyScore: 0,
          status: overallStatus,
          compile_output: results.find((row) => row.compile_output)?.compile_output || '',
          expectedOutput: results.map((row) => row.expectedOutput).join('\n'),
          isFailure: terminalStatuses.has(overallStatus) && overallStatus !== 'Accepted',
          mode: 'RUN',
          totalCases,
          totalPassed,
          results
        }
      });
    }

    const run = await runOneCompiler({ language, userCode, userStdin: stdinToRun });
    let normalizedStatus = run.status;

    return res.json({
      success: true,
      data: {
        stdout: run.stdout,
        time: run.time,
        memory: null,
        efficiencyScore: run.efficiencyScore,
        status: normalizedStatus,
        compile_output: run.compileOutput,
        expectedOutput: expectedOutput,
        isFailure: terminalStatuses.has(normalizedStatus) && normalizedStatus !== 'Accepted',
        mode: 'RUN',
        totalCases,
        totalPassed: normalizedStatus === 'Accepted' ? totalCases : 0,
        results
      }
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: error instanceof Error ? error.message : 'OneCompiler execution failed'
    });
  }
});

dsaRouter.post('/neural-pair-programmer', async (req, res, next) => {
  try {
    const { userCode, currentProblem, errorReport, userQuery, chatHistory } = req.body ?? {};

    if (!currentProblem || typeof currentProblem !== 'object') {
      return res.status(400).json({ success: false, message: 'currentProblem is required' });
    }

    const problemTitle   = String(currentProblem.title || 'this problem');
    const problemPattern = String(currentProblem.pattern || '');
    const query          = typeof userQuery === 'string' ? userQuery.trim() : '';
    const code           = typeof userCode  === 'string' ? userCode.trim()  : '';

    // Detect if this is a general question vs a code-debugging request
    const generalKeywords = /explain|what is|what does|how does|describe|tell me|what are|overview|approach|idea|concept|understand|clarify|define|summary|why|when/i;
    const isGeneralQuestion = !code || code.length < 20 || generalKeywords.test(query);

    const patternHints = {
      'Binary Search':       'Check lo/hi boundaries, mid calculation (avoid overflow), and what you return when the loop exits.',
      'Sliding Window':      'Ensure left/right pointers move consistently and window state updates before comparison.',
      'Two Pointers':        'Verify both pointers start correctly and advance under the right condition.',
      'Dynamic Programming': 'Check base cases first, then verify the transition formula and dp array size.',
      'Graph':               'Confirm visited set is initialized. Check edge direction for undirected graphs.',
      'Tree':                'Verify null/base case. Check pre-order vs post-order processing.',
      'Arrays':              'Check index bounds and empty input. Verify in-place edits don\'t corrupt data.',
      'Recursion':           'Check base case covers all terminal states. Recursive call must reduce problem size.',
      'Backtracking':        'Ensure you undo changes before returning. Check pruning condition.',
      'Greedy':              'Verify greedy choice is locally optimal. Check if sorting first helps.',
      'Prefix Sum':          'Confirm 0/1-indexed consistency. Range query formula must match indexing.',
      'Stack':               'Verify push vs compare logic. Check stack is empty when it should be.',
      'Queue':               'Confirm BFS level order. Process all nodes at current level before next.',
      'Heap':                'Check min vs max heap choice. Verify heap size constraint is enforced.',
      'Bit Manipulation':    'Use parentheses around bit ops. Verify shifts don\'t exceed integer width.',
    };

    const fallback = isGeneralQuestion
      ? `This is the **${problemTitle}** problem (pattern: ${problemPattern || 'General'}). ${patternHints[problemPattern] || 'Think about the core data structure or algorithm pattern and work through an example by hand first.'}`
      : `For **${problemTitle}**: ${patternHints[problemPattern] || 'Check edge cases, verify loop/recursion boundaries, and trace through sample input step by step.'}`;

    if (!hasGroq()) {
      return res.json({ success: true, data: { analysis: fallback, source: 'local-fallback' } });
    }

    const historyText = Array.isArray(chatHistory) && chatHistory.length > 0
      ? `\nRecent Conversation History:\n${chatHistory.join('\n')}\n`
      : '';

    // Build system prompt and user prompt based on mode
    let systemInstruction, prompt;

    if (isGeneralQuestion) {
      // General Q&A mode — answer the question about the problem naturally
      systemInstruction =
        'You are the PrepMatrix DSA Assistant — a top-tier Competitive Programming & LeetCode expert.\n' +
        'CRITICAL ACCURACY & CODE RULES:\n' +
        '1. NUMERICAL BOUNDS & DATA TYPES: Always inspect constraints (N, A[i]). Calculate potential max sum/product. If sum can exceed 2*10^9 (e.g., N=200,000, A[i]=10^9 -> max sum=2*10^14), ALWAYS use 64-bit integers (`long long` in C++, `long` in Java).\n' +
        '2. EDGE CASES: Correctly handle N=0 and negative numbers. Do NOT reject N=0 as invalid input if N=0 is allowed by constraints (0 <= N).\n' +
        '3. STABLE OUTPUT: Do NOT print extra text like "Invalid input" or "Error" unless specified in the problem output format.\n' +
        '4. CONCISE RESPONSES: Match response length to user query. If the user points out constraints or asks "what about overflow?", give a direct 1-3 sentence explanation and corrected code immediately.\n' +
        '5. Use clean markdown code blocks.';

      prompt = [
        `Problem: ${problemTitle}`,
        `Pattern: ${problemPattern}`,
        `Difficulty: ${currentProblem.difficulty || ''}`,
        '',
        `Problem description: ${currentProblem.description || ''}`,
        '',
        `Hint available: ${currentProblem.hintText || ''}`,
        historyText,
        `Student asks: ${query || 'Please explain this problem.'}`
      ].join('\n');
    } else {
      // Code debugging mode — analyse code and help fix it
      systemInstruction =
        'You are an expert pair programmer and Competitive Programming coach.\n' +
        'CRITICAL CODE DEBUGGING RULES:\n' +
        '1. Check numerical constraints: Check for integer overflow (int vs long long), array bounds, and N=0.\n' +
        '2. Be direct, accurate, and fix the root cause bug.\n' +
        '3. Match response length to user query. Avoid fluff.';

      prompt = [
        `Problem: ${problemTitle} (${problemPattern})`,
        `Description: ${currentProblem.description || ''}`,
        '',
        `Execution report: ${errorReport || 'No run yet'}`,
        '',
        `Student's code:\n\`\`\`\n${code}\n\`\`\``,
        historyText,
        `Student asks: ${query || 'Help me fix this code.'}`
      ].join('\n');
    }

    try {
      const analysisText = await groqChat(systemInstruction, prompt, { temperature: 0.6, maxTokens: 900 });
      return res.json({ success: true, data: { analysis: analysisText || fallback, source: 'groq' } });
    } catch (err) {
      console.error('[Groq DSA error]', err?.message || err);
      return res.json({ success: true, data: { analysis: fallback, source: 'local-fallback' } });
    }
  } catch (err) {
    next(err);
  }
});