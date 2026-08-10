import { Router } from 'express';
import { groqChat, hasGroq } from '../config/groq.js';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';
import { resumeUpload } from '../middleware/resumeUpload.js';
import { extractResumeText } from '../utils/extractResumeText.js';
import { AISessionModel } from '../models/AISession.js';


export const aiSuiteRouter = Router();

aiSuiteRouter.use(requireAuth);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseModelJson(text) {
  const raw = String(text ?? '').trim();
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/```json\s*([\s\S]*?)```/i) || raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }
    const candidate = match[1] ?? match[0];
    try {
      return JSON.parse(candidate);
    } catch {
      return null;
    }
  }
}

function normalizeList(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }
  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, 10);
}

function localResumeAudit({ resumeText, targetRole, jobDescription }) {
  const normalized = String(resumeText || '').toLowerCase();
  const role = String(targetRole || 'Software Engineer').trim();
  const jd = String(jobDescription || '').toLowerCase();

  const keywordBank = ['javascript', 'react', 'node', 'mongodb', 'dsa', 'sql', 'rest api', 'testing', 'docker'];
  const presentKeywords = keywordBank.filter((word) => normalized.includes(word));
  const jdKeywords = keywordBank.filter((word) => jd.includes(word));
  const overlap = jdKeywords.filter((word) => normalized.includes(word));

  const sectionHits = ['projects', 'experience', 'skills', 'education', 'achievements'].filter((section) =>
    normalized.includes(section)
  ).length;

  const scoreBase = 42 + sectionHits * 6 + presentKeywords.length * 4 + overlap.length * 4;
  const atsScore = clamp(Math.round(scoreBase), 35, 92);

  const missing = jdKeywords.filter((word) => !normalized.includes(word));

  return {
    atsScore,
    strengths: [
      sectionHits >= 3 ? 'Resume has core sections expected by ATS tools.' : 'Add clear resume sections for ATS readability.',
      presentKeywords.length >= 4
        ? `Strong technical keyword coverage for ${role}.`
        : `Keyword density can be improved for ${role} roles.`
    ],
    skillGaps: missing.slice(0, 5).map((item) => `Missing or weak mention: ${item}`),
    rewriteSuggestions: [
      'Start each project bullet with an action verb and measurable outcome.',
      'Keep each bullet under two lines and include impact metrics.',
      `Align keywords with ${role} job descriptions while staying truthful.`
    ],
    predictedQuestions: [
      'Walk me through the most challenging project in your resume.',
      'How did you measure the impact of your implementation?',
      'Which trade-offs did you make in your system design?',
      'What would you improve if you had one more sprint?'
    ],
    source: 'local-fallback'
  };
}

async function generateResumeAudit({ resumeText, targetRole, jobDescription }) {
  if (!hasGroq()) {
    return localResumeAudit({ resumeText, targetRole, jobDescription });
  }

  const systemInstruction =
    'You are SP3 Resume Intelligence. Evaluate resumes for campus placements and entry-level hiring. Return strict JSON only.';

  const prompt = [
    'Target role:',
    targetRole,
    '',
    'Job description:',
    jobDescription || '(not provided)',
    '',
    'Resume text:',
    resumeText,
    '',
    'Return JSON with keys:',
    '{',
    '  "atsScore": number(0-100),',
    '  "strengths": string[3-5],',
    '  "skillGaps": string[3-6],',
    '  "rewriteSuggestions": string[3-6],',
    '  "predictedQuestions": string[4-8]',
    '}'
  ].join('\n');

  try {
    const rawText1 = await groqChat(systemInstruction, prompt, { temperature: 0.25, maxTokens: 900 });
    const parsed = parseModelJson(rawText1);
    if (!parsed || typeof parsed !== 'object') {
      return localResumeAudit({ resumeText, targetRole, jobDescription });
    }

    return {
      atsScore: clamp(Number(parsed.atsScore || 0), 0, 100),
      strengths: normalizeList(parsed.strengths, ['Strong foundation; add more measurable outcomes.']),
      skillGaps: normalizeList(parsed.skillGaps, ['Add missing role-specific keywords from target job posts.']),
      rewriteSuggestions: normalizeList(parsed.rewriteSuggestions, ['Rewrite bullets with impact metrics and technical depth.']),
      predictedQuestions: normalizeList(parsed.predictedQuestions, ['Tell me about your strongest project and your contribution.']),
      source: 'groq'
    };
  } catch {
    return localResumeAudit({ resumeText, targetRole, jobDescription });
  }
}

function localInterviewQuestionSet({ targetRole, focusArea, difficulty, questionCount }) {
  const role = String(targetRole || 'Software Development Engineer (SDE)').trim();
  const focus = String(focusArea || 'mixed').trim().toLowerCase();
  const level = String(difficulty || 'medium').trim();

  const questionBanks = {
    os: [
      'Explain the difference between a Process and a Thread. How does the OS handle context switching between threads?',
      'What is a Deadlock in Operating Systems? Explain the 4 necessary conditions required for a deadlock to occur.',
      'Explain Virtual Memory and Paging. How does a page fault happen and how does the OS handle it?',
      'Compare CPU scheduling algorithms: Round Robin vs FCFS vs Shortest Job First. When would you choose Round Robin?',
      'What is Mutex vs Semaphore? Explain synchronization and critical section problem with a real example.'
    ],
    dbms: [
      'Explain ACID properties in Database Management Systems with a real-world transaction example.',
      'What is Database Normalization? Compare 1NF, 2NF, 3NF, and BCNF. When would you intentionally denormalize a DB?',
      'What is a Database Index? How does a B-Tree index speed up SELECT queries, and what is its write overhead?',
      'Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN in SQL with examples.',
      'What is the difference between SQL (Relational) and NoSQL (Document/Key-Value) databases? When to pick MongoDB vs Postgres?'
    ],
    cn: [
      'Explain what happens step-by-step when you type a URL like https://google.com in your browser and press Enter.',
      'Compare TCP and UDP protocols. Why is TCP preferred for web pages while UDP is preferred for live video streaming?',
      'Explain the 7 layers of the OSI model vs the 4 layers of TCP/IP model. On which layer does HTTP operate?',
      'What is the difference between HTTP and HTTPS? Explain how the TLS/SSL handshake establishes a secure connection.',
      'Explain DNS resolution process. What is the role of Recursive Resolver, TLD Server, and Authoritative Name Server?'
    ],
    oops: [
      'Explain the 4 main pillars of Object-Oriented Programming (OOPS) with clean real-world code examples.',
      'Compare Method Overloading (Compile-time Polymorphism) vs Method Overriding (Runtime Polymorphism).',
      'What is an Abstract Class vs an Interface? When would you use an Abstract Class instead of an Interface?',
      'Explain Encapsulation and Abstraction. How do access modifiers (private, protected, public) enforce data hiding?',
      'What are SOLID principles in OOPS? Explain Single Responsibility and Dependency Inversion principles.'
    ],
    dsa: [
      'How do you analyze the Time and Space Complexity of an algorithm using Big-O notation? Compare O(N log N) vs O(N^2).',
      'Explain the concept of Dynamic Programming. How does memoization differ from tabulation in solving Fibonacci?',
      'What is the difference between a BFS (Breadth-First Search) and DFS (Depth-First Search) traversal on a Graph?',
      'Compare Array vs Linked List memory allocation. Why is random access O(1) in Arrays but O(N) in Linked Lists?',
      'Explain the Two Pointer technique and Sliding Window pattern. In which array problems would you apply them?'
    ],
    system_design: [
      'How would you design a scalable URL shortener service like Bitly? Explain database schema and hash generation.',
      'What is Load Balancing? Compare Round-Robin vs Least Connections vs IP-Hash load balancing strategies.',
      'Explain Caching strategies (Redis/Memcached). How do you handle cache invalidation and cache stampede?',
      'What is Database Sharding vs Replication? How does master-slave replication work in distributed systems?'
    ],
    project: [
      'Walk me through the architecture of your primary resume project. What tech stack did you choose and why?',
      'Describe the hardest technical bug you encountered in your project. How did you trace and resolve it?',
      'How did you handle authentication, data security, and API response performance in your project?'
    ],
    hr: [
      'Tell me about a time when you had a disagreement with a teammate during a group project. How did you handle it?',
      `Why do you want to join our team as a ${role}, and where do you see your technical growth in 3 years?`,
      'Describe a situation where a project deadline was at risk. How did you prioritize your tasks to deliver on time?'
    ],
    mixed: [
      `Introduce yourself in 60 seconds for a ${role} campus placement interview.`,
      'Explain one project from your resume and your individual contribution.',
      'Explain the difference between a Process and a Thread in Operating Systems.',
      'What are ACID properties in Database Management Systems?',
      'How do you analyze time complexity using Big-O notation? Give an example of O(N log N).'
    ]
  };

  const selectedList = questionBanks[focus] || questionBanks.mixed;
  return selectedList.slice(0, clamp(questionCount, 3, 8)).map((text, index) => ({
    index,
    text,
    expectedSignals: [
      'structured answer',
      'technical depth',
      'core concept clarity',
      'practical example'
    ]
  }));
}

async function generateInterviewQuestionSet({ targetRole, focusArea, difficulty, questionCount, resumeText }) {
  if (!hasGroq()) {
    return localInterviewQuestionSet({ targetRole, focusArea, difficulty, questionCount });
  }

  const focusDescriptions = {
    os: 'Operating Systems (Process vs Thread, Deadlocks, Virtual Memory, CPU Scheduling, Synchronization)',
    dbms: 'Database Management Systems & SQL (ACID, Normalization 1NF-3NF, B-Tree Indexes, SQL Joins, Transactions)',
    cn: 'Computer Networks (OSI & TCP/IP Layers, TCP vs UDP, HTTP/HTTPS TLS Handshake, DNS Resolution)',
    oops: 'Object-Oriented Programming (Inheritance, Polymorphism, Abstraction, Encapsulation, SOLID Principles)',
    dsa: 'Data Structures & Algorithms (Big-O Complexity, Dynamic Programming, BFS/DFS, Trees, Arrays, Pointers)',
    system_design: 'System Design & Architecture (Load Balancers, Caching, DB Sharding, Scalability, URL Shortener)',
    project: 'Resume Project Deep Dive (Architecture, tech stack trade-offs, state management, security, bug fixes)',
    hr: 'HR & Behavioural (STAR Method, teamwork, conflict resolution, career goals, problem solving)',
    mixed: 'Comprehensive SDE Technical Panel (Mixed DSA, CS Fundamentals OS/DBMS/CN/OOPS, & Project questions)'
  };

  const focusText = focusDescriptions[focusArea?.toLowerCase()] || focusDescriptions.mixed;

  const prompt = [
    'Generate specialized technical mock interview questions for a campus placement candidate.',
    `Target role: ${targetRole}`,
    `Focus area: ${focusText}`,
    `Difficulty level: ${difficulty}`,
    `Number of questions: ${questionCount}`,
    '',
    'Resume snippet (tailor questions to projects/skills if provided):',
    resumeText || '(not provided)',
    '',
    'Instructions:',
    '- Ask realistic technical interview questions expected in Tier-1 software company campus placements (Amazon, Google, TCS, Infosys, Wipro, Microsoft).',
    `- Ensure questions focus specifically on: ${focusText}.`,
    '- Return a strict JSON array with exact format:',
    '[',
    '  {"index":0, "text":"...", "expectedSignals":["signal1", "signal2"]}',
    ']'
  ].join('\n');

  try {
    const rawText2 = await groqChat(
      'You are an expert technical interviewer for SDE campus placement drives. Return only strict JSON, no extra markdown text.',
      prompt,
      { temperature: 0.3, maxTokens: 1000 }
    );
    const parsed = parseModelJson(rawText2);
    if (!Array.isArray(parsed)) {
      return localInterviewQuestionSet({ targetRole, focusArea, difficulty, questionCount });
    }

    const cleaned = parsed
      .map((item, idx) => ({
        index: typeof item?.index === 'number' ? item.index : idx,
        text: String(item?.text || '').trim(),
        expectedSignals: normalizeList(item?.expectedSignals, ['clarity', 'depth'])
      }))
      .filter((item) => item.text)
      .slice(0, clamp(questionCount, 3, 8));

    if (cleaned.length === 0) {
      return localInterviewQuestionSet({ targetRole, focusArea, difficulty, questionCount });
    }

    return cleaned;
  } catch {
    return localInterviewQuestionSet({ targetRole, focusArea, difficulty, questionCount });
  }
}

function localAnswerEvaluation({ answerText, questionText }) {
  const words = String(answerText || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const wordCount = words.length;

  const technicalScore = clamp(Math.round(wordCount / 4), 35, 85);
  const communicationScore = clamp(40 + Math.round(wordCount / 5), 35, 90);
  const confidenceScore = clamp(45 + Math.round(wordCount / 6), 35, 90);
  const score = Math.round((technicalScore * 0.45 + communicationScore * 0.3 + confidenceScore * 0.25) * 10) / 10;

  return {
    score,
    technicalScore,
    communicationScore,
    confidenceScore,
    feedback:
      wordCount < 30
        ? 'Answer is too short. Use STAR: Situation, Task, Action, Result with concrete details.'
        : 'Good baseline. Improve by adding metrics, constraints, and one trade-off discussion.',
    followUpQuestion: `Can you quantify the impact of your answer for: ${questionText}`,
    source: 'local-fallback'
  };
}

async function evaluateAnswer({ questionText, answerText, targetRole, difficulty }) {
  if (!hasGroq()) {
    return localAnswerEvaluation({ answerText, questionText });
  }

  const prompt = [
    'You are an interviewer scoring one candidate answer.',
    `Target role: ${targetRole}`,
    `Difficulty: ${difficulty}`,
    '',
    `Question: ${questionText}`,
    `Answer: ${answerText}`,
    '',
    'Note: If candidate explicitly asks for help, hints, simpler questions, or topic changes, do not give a harsh 0 — score communication/confidence fairly for self-awareness.',
    '',
    'Return strict JSON:',
    '{',
    '  "score": number(0-100),',
    '  "technicalScore": number(0-100),',
    '  "communicationScore": number(0-100),',
    '  "confidenceScore": number(0-100),',
    '  "feedback": "short actionable feedback",',
    '  "followUpQuestion": "one follow-up question"',
    '}'
  ].join('\n');

  try {
    const rawText3 = await groqChat(
      'You are an expert interviewer scoring candidate answers. Return only strict JSON, no extra text.',
      prompt,
      { temperature: 0.3, maxTokens: 450 }
    );
    const parsed = parseModelJson(rawText3);
    if (!parsed || typeof parsed !== 'object') {
      return localAnswerEvaluation({ answerText, questionText });
    }

    return {
      score: clamp(Number(parsed.score || 0), 0, 100),
      technicalScore: clamp(Number(parsed.technicalScore || 0), 0, 100),
      communicationScore: clamp(Number(parsed.communicationScore || 0), 0, 100),
      confidenceScore: clamp(Number(parsed.confidenceScore || 0), 0, 100),
      feedback: String(parsed.feedback || 'Good effort. Add more concrete technical detail.').trim(),
      followUpQuestion: String(parsed.followUpQuestion || '').trim(),
      source: 'groq'
    };
  } catch {
    return localAnswerEvaluation({ answerText, questionText });
  }
}

function localInterviewerMessage({
  candidateAnswer,
  evaluation,
  nextQuestionText,
  isFirstTurn = false,
  isFlowComplete = false,
  targetRole = 'Software Engineer'
}) {
  if (isFirstTurn) {
    return `Welcome. I will run this ${targetRole} mock interview like a real interviewer: concise, specific, and follow-up driven. ${nextQuestionText}`;
  }

  if (isFlowComplete) {
    return `Thank you. That wraps our question round. Your responses are noted. Click Finish Interview to receive your full performance report.`;
  }

  const answerWords = String(candidateAnswer || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const pacingHint = answerWords < 25 ? 'Give slightly more depth in your next answer.' : 'Keep this concise structure in your next answer.';

  return `Noted. ${evaluation.feedback} ${pacingHint} Next question: ${nextQuestionText}`;
}

async function generateInterviewerMessage({
  session,
  candidateAnswer,
  evaluation,
  nextQuestionText,
  isFirstTurn = false,
  isFlowComplete = false
}) {
  if (!hasGroq()) {
    return localInterviewerMessage({
      candidateAnswer,
      evaluation,
      nextQuestionText,
      isFirstTurn,
      isFlowComplete,
      targetRole: session?.targetRole || 'Software Engineer'
    });
  }

  const prompt = [
    'You are a supportive, highly intelligent technical AI interviewer and placement coach.',
    `Target role: ${session?.targetRole || 'Software Development Engineer (SDE)'}`,
    `Focus area: ${session?.focusArea || 'mixed'}`,
    `Difficulty: ${session?.difficulty || 'medium'}`,
    `First turn: ${isFirstTurn ? 'yes' : 'no'}`,
    `Flow complete: ${isFlowComplete ? 'yes' : 'no'}`,
    `Candidate spoken response: ${candidateAnswer || '(none)'}`,
    `Evaluation feedback: ${evaluation?.feedback || '(none)'}`,
    `Scheduled next question: ${nextQuestionText || '(none)'}`,
    '',
    'CRITICAL CONVERSATIONAL ADAPTATION INSTRUCTIONS:',
    '1. Check candidate spoken response for any request for help, simpler/basic questions, hints, or topic changes.',
    '2. If candidate asks for basic/simpler questions or says they struggle: Warmly acknowledge them ("No problem at all! Let\'s step back to the basics..."), give a brief 1-sentence hint or explanation, and ask an easier foundational question instead.',
    '3. If candidate requests a specific subject (e.g. OS, DBMS, DSA, OOPS, CN, Projects): Immediately adapt to that subject for the next question!',
    '4. Otherwise: Briefly acknowledge their answer with concise constructive feedback (1 sentence), then transition smoothly to the next question.',
    '5. Sound 100% natural, empathetic, and human — like ChatGPT Voice Mode. Keep response under 70 words. Do not use bullet points or markdown syntax since this will be spoken aloud.'
  ].join('\n');

  try {
    const interviewerText = await groqChat(
      'You are a natural, empathetic AI technical interviewer like ChatGPT Voice Mode. Speak conversationally and adapt dynamically to candidate requests.',
      prompt,
      { temperature: 0.7, maxTokens: 300 }
    );
    if (interviewerText) {
      return interviewerText;
    }
  } catch {
    // Fall through to local fallback.
  }

  return localInterviewerMessage({
    candidateAnswer,
    evaluation,
    nextQuestionText,
    isFirstTurn,
    isFlowComplete,
    targetRole: session?.targetRole || 'Software Engineer'
  });
}

async function buildFinalReport(session) {
  const answers = Array.isArray(session.answers) ? session.answers : [];
  if (answers.length === 0) {
    return {
      overallScore: 0,
      strengths: ['Interview not attempted yet.'],
      growthAreas: ['Start answering questions to unlock analytics.'],
      nextWeekPlan: ['Practice one interview daily with STAR answers.'],
      source: 'local-fallback'
    };
  }

  const overallScore = Math.round(answers.reduce((acc, row) => acc + Number(row.score || 0), 0) / answers.length);

  if (!hasGroq()) {
    return {
      overallScore,
      strengths: ['Good consistency in attempt completion.', 'Communication is improving with each response.'],
      growthAreas: ['Increase technical depth and quantify outcomes.', 'Reduce filler language and tighten structure.'],
      nextWeekPlan: [
        'Day 1-2: Record two 90-second project explanations.',
        'Day 3-4: Practice debugging and system design trade-off answers.',
        'Day 5-7: Simulate one timed interview daily.'
      ],
      source: 'local-fallback'
    };
  }

  const compactAnswers = answers.map((row) => ({
    question: row.questionText,
    score: row.score,
    feedback: row.feedback
  }));

  const prompt = [
    'Create a final mock interview report from this data.',
    `Target role: ${session.targetRole || 'Software Engineer'}`,
    `Difficulty: ${session.difficulty || 'medium'}`,
    `Average score: ${overallScore}`,
    'Q/A summary JSON:',
    JSON.stringify(compactAnswers),
    '',
    'Return strict JSON:',
    '{',
    '  "overallScore": number(0-100),',
    '  "strengths": string[2-5],',
    '  "growthAreas": string[2-5],',
    '  "nextWeekPlan": string[3-6]',
    '}'
  ].join('\n');

  try {
    const rawText5 = await groqChat(
      'You are an expert career coach generating interview performance reports. Return only strict JSON, no extra text.',
      prompt,
      { temperature: 0.25, maxTokens: 700 }
    );
    const parsed = parseModelJson(rawText5);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid final report payload');
    }

    return {
      overallScore: clamp(Number(parsed.overallScore || overallScore), 0, 100),
      strengths: normalizeList(parsed.strengths, ['Strong baseline communication and consistency.']),
      growthAreas: normalizeList(parsed.growthAreas, ['Increase technical precision in answers.']),
      nextWeekPlan: normalizeList(parsed.nextWeekPlan, ['Practice one full mock interview daily.']),
      source: 'groq'
    };
  } catch {
    return {
      overallScore,
      strengths: ['Good consistency in attempt completion.', 'Communication is improving with each response.'],
      growthAreas: ['Increase technical depth and quantify outcomes.', 'Reduce filler language and tighten structure.'],
      nextWeekPlan: [
        'Day 1-2: Record two 90-second project explanations.',
        'Day 3-4: Practice debugging and system design trade-off answers.',
        'Day 5-7: Simulate one timed interview daily.'
      ],
      source: 'local-fallback'
    };
  }
}

aiSuiteRouter.get('/overview', async (req, res, next) => {
  try {
    const [latestAudit, latestInterview] = await Promise.all([
      AISessionModel.findOne({ userId: req.auth.userId, type: 'resume-audit' }).sort({ createdAt: -1 }).lean(),
      AISessionModel.findOne({ userId: req.auth.userId, type: 'mock-interview' }).sort({ createdAt: -1 }).lean()
    ]);

    return res.json({
      success: true,
      data: {
        latestAudit: latestAudit
          ? {
              id: latestAudit._id.toString(),
              atsScore: latestAudit.auditResult?.atsScore ?? null,
              targetRole: latestAudit.targetRole,
              createdAt: latestAudit.createdAt
            }
          : null,
        latestInterview: latestInterview
          ? {
              id: latestInterview._id.toString(),
              status: latestInterview.status,
              targetRole: latestInterview.targetRole,
              overallScore: latestInterview.report?.overallScore ?? null,
              createdAt: latestInterview.createdAt
            }
          : null
      }
    });
  } catch (err) {
    next(err);
  }
});

aiSuiteRouter.post(
  '/resume-parse',
  (req, res, next) => {
    resumeUpload.single('resumeFile')(req, res, (err) => {
      if (err) {
        // Covers both multer's own errors (file too large, too many files)
        // and the fileFilter rejection (wrong file type) — both arrive here.
        return res.status(400).json({ success: false, message: err.message || 'File upload failed.' });
      }
      next();
    });
  },
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file was uploaded.' });
      }

      const resumeText = await extractResumeText({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname
      });

      return res.json({
        success: true,
        data: {
          resumeText,
          fileName: req.file.originalname
        }
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message || 'Could not parse this file.' });
    }
  }
);

aiSuiteRouter.post('/resume-audit', async (req, res, next) => {
  try {
    const { resumeText, targetRole, jobDescription } = req.body ?? {};

    const resume = typeof resumeText === 'string' ? resumeText.trim() : '';
    const role = typeof targetRole === 'string' ? targetRole.trim() : '';
    const jd = typeof jobDescription === 'string' ? jobDescription.trim() : '';

    if (!resume || resume.length < 120) {
      return res.status(400).json({ success: false, message: 'Paste at least 120 characters of resume content.' });
    }

    const audit = await generateResumeAudit({
      resumeText: resume,
      targetRole: role || 'Software Engineer',
      jobDescription: jd
    });

    const row = await AISessionModel.create({
      userId: req.auth.userId,
      type: 'resume-audit',
      status: 'completed',
      targetRole: role,
      resumeSnapshot: resume,
      jobDescriptionSnapshot: jd,
      auditResult: audit,
      report: {
        overallScore: audit.atsScore
      }
    });

    return res.json({
      success: true,
      data: {
        sessionId: row._id.toString(),
        ...audit
      }
    });
  } catch (err) {
    next(err);
  }
});

aiSuiteRouter.post('/mock-interview/start', async (req, res, next) => {
  try {
    const { targetRole, focusArea, difficulty, resumeText, questionCount } = req.body ?? {};

    const role = typeof targetRole === 'string' && targetRole.trim() ? targetRole.trim() : 'Software Engineer';
    const focus = typeof focusArea === 'string' && focusArea.trim() ? focusArea.trim() : 'mixed';
    const level = typeof difficulty === 'string' && difficulty.trim() ? difficulty.trim() : 'medium';
    const resume = typeof resumeText === 'string' ? resumeText.trim() : '';
    const count = clamp(Number(questionCount || 5), 3, 8);

    const questions = await generateInterviewQuestionSet({
      targetRole: role,
      focusArea: focus,
      difficulty: level,
      questionCount: count,
      resumeText: resume
    });

    const row = await AISessionModel.create({
      userId: req.auth.userId,
      type: 'mock-interview',
      status: 'active',
      targetRole: role,
      focusArea: focus,
      difficulty: level,
      resumeSnapshot: resume,
      questions,
      answers: [],
      currentQuestionIndex: 0,
      conversationTurns: []
    });

    const firstQuestion = questions.find((item) => item.index === 0) || questions[0] || null;
    const openingInterviewerText = await generateInterviewerMessage({
      session: row,
      candidateAnswer: '',
      evaluation: null,
      nextQuestionText: firstQuestion?.text || 'Tell me about yourself.',
      isFirstTurn: true,
      isFlowComplete: false
    });

    row.conversationTurns.push({
      role: 'interviewer',
      text: openingInterviewerText,
      questionIndex: firstQuestion?.index ?? 0
    });

    await row.save();

    return res.json({
      success: true,
      data: {
        sessionId: row._id.toString(),
        targetRole: role,
        focusArea: focus,
        difficulty: level,
        questions,
        currentQuestionIndex: firstQuestion?.index ?? 0,
        activeQuestion: firstQuestion,
        conversationTurns: row.conversationTurns
      }
    });
  } catch (err) {
    next(err);
  }
});

aiSuiteRouter.post('/mock-interview/answer', async (req, res, next) => {
  try {
    const { sessionId, questionIndex, answerText, durationSeconds } = req.body ?? {};

    const sid = typeof sessionId === 'string' ? sessionId.trim() : '';
    const qIndexRaw = Number(questionIndex);
    const answer = typeof answerText === 'string' ? answerText.trim() : '';
    const duration = clamp(Number(durationSeconds || 0), 0, 1800);

    if (!sid) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }
    if (answer.length < 10) {
      return res.status(400).json({ success: false, message: 'Answer is too short. Provide a detailed response.' });
    }

    const session = await AISessionModel.findOne({
      _id: sid,
      userId: req.auth.userId,
      type: 'mock-interview'
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    if (session.status === 'completed') {
      return res.status(409).json({ success: false, message: 'Interview session already completed' });
    }

    const qIndex = Number.isInteger(qIndexRaw) && qIndexRaw >= 0 ? qIndexRaw : Number(session.currentQuestionIndex || 0);

    const question = Array.isArray(session.questions) ? session.questions.find((row) => row.index === qIndex) : null;
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found in this session' });
    }

    if (qIndex !== Number(session.currentQuestionIndex || 0)) {
      return res.status(409).json({ success: false, message: 'This question is no longer active. Use the latest interviewer prompt.' });
    }

    session.conversationTurns.push({
      role: 'candidate',
      text: answer,
      questionIndex: qIndex
    });

    const evaluation = await evaluateAnswer({
      questionText: question.text,
      answerText: answer,
      targetRole: session.targetRole,
      difficulty: session.difficulty
    });

    const existingIndex = session.answers.findIndex((row) => row.questionIndex === qIndex);
    const answerRow = {
      questionIndex: qIndex,
      questionText: question.text,
      answerText: answer,
      durationSeconds: duration,
      score: evaluation.score,
      technicalScore: evaluation.technicalScore,
      communicationScore: evaluation.communicationScore,
      confidenceScore: evaluation.confidenceScore,
      feedback: evaluation.feedback,
      followUpQuestion: evaluation.followUpQuestion
    };

    if (existingIndex >= 0) {
      session.answers[existingIndex] = answerRow;
    } else {
      session.answers.push(answerRow);
    }

    const nextQuestionIndex = qIndex + 1;
    const nextQuestion = Array.isArray(session.questions)
      ? session.questions.find((row) => row.index === nextQuestionIndex) ?? null
      : null;
    const isQuestionFlowComplete = !nextQuestion;

    const interviewerMessage = await generateInterviewerMessage({
      session,
      candidateAnswer: answer,
      evaluation,
      nextQuestionText: nextQuestion?.text || '',
      isFirstTurn: false,
      isFlowComplete: isQuestionFlowComplete
    });

    session.conversationTurns.push({
      role: 'interviewer',
      text: interviewerMessage,
      questionIndex: nextQuestion?.index ?? qIndex,
      score: evaluation.score
    });

    if (nextQuestion) {
      session.currentQuestionIndex = nextQuestion.index;
    }

    await session.save();

    return res.json({
      success: true,
      data: {
        questionIndex: qIndex,
        ...evaluation,
        attemptedCount: session.answers.length,
        totalCount: session.questions.length,
        interviewerMessage,
        nextQuestionIndex: nextQuestion?.index ?? null,
        activeQuestion: nextQuestion,
        isQuestionFlowComplete,
        conversationTurns: session.conversationTurns
      }
    });
  } catch (err) {
    next(err);
  }
});

aiSuiteRouter.post('/mock-interview/finish', async (req, res, next) => {
  try {
    const { sessionId } = req.body ?? {};
    const sid = typeof sessionId === 'string' ? sessionId.trim() : '';

    if (!sid) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }

    const session = await AISessionModel.findOne({
      _id: sid,
      userId: req.auth.userId,
      type: 'mock-interview'
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    const report = await buildFinalReport(session);
    session.status = 'completed';
    session.report = report;
    await session.save();

    return res.json({
      success: true,
      data: {
        sessionId: session._id.toString(),
        report,
        answers: session.answers,
        conversationTurns: session.conversationTurns
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai-suite/tutor/chat
aiSuiteRouter.post('/tutor/chat', async (req, res, next) => {
  try {
    const { message, turns = [], resumeText = '' } = req.body ?? {};
    const userMsg = String(message || '').trim();

    if (!userMsg) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!hasGroq()) {
      let localReply = `That's a great topic to practice! Can you explain the fundamental principles behind it?`;
      if (userMsg.toLowerCase().includes('data structure') || userMsg.toLowerCase().includes('dsa')) {
        localReply = `Data Structures is essential for placements! Let me ask: What is the main difference between an Array and a Linked List in memory allocation?`;
      } else if (userMsg.toLowerCase().includes('operating system') || userMsg.toLowerCase().includes('os')) {
        localReply = `Operating Systems is a core placement subject! What is the difference between a Process and a Thread?`;
      } else if (userMsg.toLowerCase().includes('dbms') || userMsg.toLowerCase().includes('sql')) {
        localReply = `Database Systems & SQL! Explain what ACID properties mean in database transactions with an example.`;
      }
      return res.json({ success: true, reply: localReply });
    }

    const conversationContext = turns
      .slice(-8)
      .map(t => `${t.role === 'interviewer' ? 'AI Tutor' : 'Candidate'}: ${t.text}`)
      .join('\n');

    const prompt = [
      'You are a supportive, highly intelligent AI Voice Placement Tutor.',
      'Your goal is to conduct a natural 1-on-1 voice interview practice session like ChatGPT Voice Mode.',
      '',
      'Recent Conversation History:',
      conversationContext || '(None yet)',
      '',
      `Latest Candidate Spoken Input: "${userMsg}"`,
      '',
      'CRITICAL CHATGPT-VOICE-MODE RULES:',
      '1. IMMEDIATE TOPIC SWITCHING & NEGATION HANDLING:',
      '   - TOPIC REQUEST: If candidate asks to switch to a subject (e.g. "Data Structures", "DSA", "OS", "OOPS", "DBMS"): IMMEDIATELY switch to that requested subject! Acknowledge in 5 words and ask a question on the NEW subject right away!',
      '   - NEGATION / REJECTION: If candidate says "I don\'t know X", "didn\'t prepare X", "skip X", or "avoid X" (e.g. "I didn\'t prepare System Design"): DO NOT ASK QUESTIONS ON X! Immediately apologize in 5 words and switch to a subject they prefer (e.g. Data Structures or OOPS)!',
      '2. TEACHING & TUTORIAL REQUESTS (TOP PRIORITY):',
      '   - If candidate asks "explain X to me", "teach me X", "give me a tutorial on X", "tell me what X is", or "stop asking questions":',
      '     IMMEDIATELY STOP ASKING QUESTIONS! Give a warm, clear 2-3 sentence concept explanation of X (e.g. explaining Hash Tables with key-value pairs, hash functions, and O(1) lookup time). End by asking warmly: "Does this concept make sense, or would you like a quick example?"',
      '3. SKIP & NEXT QUESTION REQUESTS: If candidate says "skip this question", "next question", or "ask another question": Instantly drop the current question and ask a brand-new technical question!',
      '4. NEVER FORCE PREVIOUS TOPICS: Never force the candidate back to a topic they rejected or asked to leave (e.g. if candidate rejected System Design or DBMS, NEVER say "Let\'s get back to System Design"). Obey their preference instantly!',
      '5. CONSTRUCTIVE FEEDBACK & IDEAL ANSWER ENHANCEMENT (CRITICAL):',
      '   - When candidate attempts an answer to your question:',
      '     1. Praise what they got right in 1 short sentence.',
      '     2. Provide the IDEAL / OPTIMAL interview answer or key missing detail in 1-2 concise spoken sentences (e.g. "A better way to phrase this in an interview is...").',
      '     3. Then ask the next technical question on the topic!',
      '6. DIRECT TECHNICAL PLACEMENT QUESTIONS: Ask clear, practical technical interview questions (e.g. Hash Tables, Arrays, Linked Lists, Stacks, OS Processes/Threads, SQL Joins). Avoid meta-questions like "What do you think is challenging?".',
      '7. PATIENCE ON PAUSE: If candidate says "wait", "give me a second", "hold on", or asks for time: Warmly reply "Take all the time you need! I am right here whenever you are ready."',
      '8. CONVERSATIONAL VOICE FORMAT: Write in clean, natural spoken English (max 60 words). No markdown, bullet points, or code blocks since this is spoken aloud via Text-to-Speech.'
    ].join('\n');

    const aiReply = await groqChat(
      'You are a dynamic, supportive AI Voice Placement Tutor & Teacher like ChatGPT Voice Mode. You teach concepts when requested, provide ideal answer explanations, handle topic switches instantly, and help students master interview answers.',
      prompt,
      { temperature: 0.6, maxTokens: 260 }
    );

    return res.json({
      success: true,
      reply: aiReply || `Let's keep practicing! Tell me more about your thoughts on this topic.`
    });
  } catch (err) {
    next(err);
  }
});