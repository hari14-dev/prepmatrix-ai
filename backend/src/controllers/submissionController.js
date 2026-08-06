import { env } from '../config/env.js';
import { DSAProblemModel } from '../models/DSAProblem.js';
import { UserModel } from '../models/User.js';
import { UserSubmissionModel } from '../models/UserSubmission.js';

const oneCompilerLanguageMap = {
  cpp: 'cpp',
  java: 'java',
  python: 'python3',
  python3: 'python3',
  javascript: 'nodejs',
  nodejs: 'nodejs'
};

const normalizeLanguageForModel = (language) =>
  language === 'python3' ? 'python' : language === 'nodejs' ? 'javascript' : language;

const normalizeOutput = (value) =>
  String(value ?? '')
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim().replace(/[ \t]+/g, ' '))
    .join('\n')
    .trim();

export function compareOutputs(actual, expected) {
  return normalizeOutput(actual) === normalizeOutput(expected);
}

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

  const response = await fetch(`${env.ONECOMPILER_API_URL}${path}`, {
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

function classifyStatus(stderrText) {
  const stderr = String(stderrText || '').toLowerCase();
  if (!stderr) {
    return 'Accepted';
  }
  if (stderr.includes('time limit')) {
    return 'Time Limit Exceeded';
  }
  if (stderr.includes('compilation') || stderr.includes('error:')) {
    return 'Compilation Error';
  }
  return 'Runtime Error';
}

async function executeCase({ language, userCode, input }) {
  const result = await oneCompilerRequest('/api/v1/run', {
    method: 'POST',
    body: {
      language: oneCompilerLanguageMap[language],
      files: [{ name: resolveFileName(language), content: userCode }],
      stdin: String(input ?? '').replace(/\r/g, '')
    }
  });

  const actualOutput = normalizeOutput(result?.stdout ?? result?.output);
  const stderr = normalizeOutput(result?.stderr || result?.error);
  const status = classifyStatus(stderr);
  const time = Number(result?.executionTime || 0) / 1000;

  return { actualOutput, stderr, status, time };
}

async function logSubmission({ userId, problemId, code, language, status, time }) {
  await UserSubmissionModel.create({
    userId,
    problemId,
    code,
    language: normalizeLanguageForModel(language),
    status: status === 'Accepted' ? 'Accepted' : status === 'Runtime Error' ? 'Runtime' : 'Wrong',
    runtime: Math.max(0, Math.round(Number(time || 0) * 1000)),
    memory: 0
  });
}

export async function handleSubmitRequest(req, res, next) {
  const { problemId, userCode, language } = req.body ?? {};

  if (typeof problemId !== 'string' || !problemId.trim()) {
    return res.status(400).json({ success: false, message: 'problemId is required' });
  }
  if (typeof userCode !== 'string' || !userCode.trim()) {
    return res.status(400).json({ success: false, message: 'userCode is required' });
  }
  if (!oneCompilerLanguageMap[language]) {
    return res.status(400).json({ success: false, message: 'language is invalid' });
  }

  let problem;
  try {
    problem = await DSAProblemModel.findById(problemId, { testCases: 1, title: 1 }).lean();
  } catch (err) {
    return next(err);
  }
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  const testCases = Array.isArray(problem.testCases) ? problem.testCases : [];
  if (testCases.length === 0) {
    return res.status(400).json({ success: false, message: 'No test cases configured for problem' });
  }

  try {
    const results = [];
    let passedCount = 0;
    let totalTime = 0;
    let terminalFailureStatus = null;
    let terminalFailureStderr = '';

    for (const [index, testCase] of testCases.entries()) {
      const caseNumber = index + 1;
      const isPublic = typeof testCase.isPublic === 'boolean' ? testCase.isPublic : !testCase.isHidden;

      if (terminalFailureStatus) {
        results.push({
          caseNumber,
          passed: false,
          status: 'Skipped',
          visibility: isPublic ? 'public' : 'hidden'
        });
        continue;
      }

      const input = String(testCase.input ?? '');
      const expectedOutput = String(testCase.expectedOutput ?? '');
      const { actualOutput, stderr, status, time } = await executeCase({ language, userCode, input });
      totalTime += Number(time || 0);

      if (status !== 'Accepted') {
        terminalFailureStatus = status;
        terminalFailureStderr = stderr;
        results.push({
          caseNumber,
          passed: false,
          status,
          visibility: isPublic ? 'public' : 'hidden',
          ...(isPublic
            ? {
                input,
                expectedOutput,
                actualOutput,
                compile_output: stderr
              }
            : {})
        });
        continue;
      }

      const passed = compareOutputs(actualOutput, expectedOutput);
      if (passed) {
        passedCount += 1;
      }

      results.push({
        caseNumber,
        passed,
        status: passed ? 'Accepted' : 'Wrong Answer',
        visibility: isPublic ? 'public' : 'hidden',
        ...(isPublic
          ? {
              input,
              expectedOutput,
              actualOutput
            }
          : {})
      });
    }

    const totalCount = testCases.length;
    const overallStatus = terminalFailureStatus
      ? terminalFailureStatus
      : passedCount === totalCount
        ? 'Accepted'
        : 'Wrong Answer';

    const success = overallStatus === 'Accepted';

    await logSubmission({
      userId: req.auth.userId,
      problemId,
      code: userCode,
      language,
      status: overallStatus,
      time: totalTime
    });

    if (success) {
      await UserModel.updateOne({ _id: req.auth.userId }, { $inc: { readinessScore: 1 } });
    }

    const firstFailed = results.find((row) => row.status !== 'Accepted');

    return res.json({
      success,
      status: overallStatus,
      passedCount,
      totalCount,
      time: totalTime,
      compile_output: terminalFailureStderr,
      failedOn: firstFailed ? firstFailed.caseNumber : null,
      results
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      status: 'Runtime Error',
      message: error instanceof Error ? error.message : 'Submission evaluation failed'
    });
  }
}