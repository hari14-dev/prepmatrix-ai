import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { requireAuth } from '../middleware/auth.js';
import { UserModel } from '../models/User.js';
import { signAuthToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import { sendOtpEmail } from '../utils/mailer.js';

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validateRegisterInput = (body) => {
  if (!body || typeof body !== 'object') {
    return 'Invalid input';
  }

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (fullName.length < 2) {
    return 'Full name must be at least 2 characters';
  }

  if (!isEmail(email)) {
    return 'Valid email address is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return null;
};

const validateLoginInput = (body) => {
  if (!body || typeof body !== 'object') {
    return 'Invalid input';
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!isEmail(email)) {
    return 'Valid email address is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return null;
};

export const authRouter = Router();

// Temporary in-memory store for 6-digit registration verification codes
const otpStore = new Map();
// Temporary in-memory store for 6-digit password reset codes
const resetOtpStore = new Map();

// POST /api/auth/send-otp
authRouter.post('/send-otp', async (req, res, next) => {
  try {
    const validationError = validateRegisterInput(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const fullName = req.body.fullName.trim();
    const email = req.body.email.trim().toLowerCase();

    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered. Please sign in instead.' });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    otpStore.set(email, {
      otp,
      expiresAt,
      fullName,
      passwordHash
    });

    const mailResult = await sendOtpEmail(email, otp, fullName);

    return res.status(200).json({
      success: true,
      message: mailResult.sent
        ? `Verification code sent to ${email}. Check your inbox!`
        : `Verification code generated for ${email}.`,
      otp: mailResult.dev ? otp : undefined, // Only included in local dev mode when no SMTP key exists
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-otp
authRouter.post('/verify-otp', async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const otp = typeof req.body.otp === 'string' ? req.body.otp.trim() : '';

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit verification code are required' });
    }

    const stored = otpStore.get(email);
    if (!stored) {
      return res.status(400).json({ success: false, message: 'No verification code found for this email or it has expired. Please request a new code.' });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new code.' });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please check your code and try again.' });
    }

    // OTP matched! Create user account
    const user = await UserModel.create({
      fullName: stored.fullName,
      email,
      passwordHash: stored.passwordHash
    });

    otpStore.delete(email);
    const token = signAuthToken({ userId: user.id, email: user.email });

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          readinessScore: user.readinessScore,
          streakDays: user.streakDays
        }
      }
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }
    next(err);
  }
});

authRouter.post('/register', async (req, res, next) => {
  try {
    const validationError = validateRegisterInput(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const fullName = req.body.fullName.trim();
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;
    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ fullName, email, passwordHash });
    const token = signAuthToken({ userId: user.id, email: user.email });

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          readinessScore: user.readinessScore,
          streakDays: user.streakDays
        }
      }
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }
    next(err);
  }
});

// Lazily created — only needed if Google login is actually configured.
const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

// POST /api/auth/forgot-password
authRouter.post('/forgot-password', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!email) return res.status(400).json({ success: false, message: 'Email address is required' });

    const user = await UserModel.findOne({ email });
    if (!user) {
      // Return success even if not found to prevent account enumeration
      return res.json({ success: true, message: 'If an account exists, reset instructions have been sent.' });
    }

    if (user.authProvider === 'google') {
      return res.status(400).json({ success: false, message: 'This email uses Google Sign-In. Please sign in with Google.' });
    }

    // Generate 6-digit OTP code for password reset email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    resetOtpStore.set(email, {
      otp,
      createdAt: Date.now()
    });

    const mailResult = await sendOtpEmail(email, otp, user.fullName || 'User');

    return res.json({
      success: true,
      message: 'Password reset OTP sent to your email.',
      dev: mailResult?.dev || false,
      otp: mailResult?.dev ? otp : undefined
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/reset-password
authRouter.post('/reset-password', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const otp = typeof req.body?.otp === 'string' ? req.body.otp.trim() : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const stored = resetOtpStore.get(email);
    if (!stored) {
      return res.status(400).json({ success: false, message: 'Reset code expired or not requested. Please request a new code.' });
    }

    // Check expiry (10 mins)
    if (Date.now() - stored.createdAt > 10 * 60 * 1000) {
      resetOtpStore.delete(email);
      return res.status(400).json({ success: false, message: 'Reset code has expired. Please request a new code.' });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please check your email and try again.' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    resetOtpStore.delete(email);

    return res.json({ success: true, message: 'Password reset successfully! You can now sign in with your new password.' });
  } catch (err) {
    next(err);
  }
});


// POST /api/auth/google
// Body: { credential } — the ID token JWT returned by Google Identity
// Services on the frontend (google.accounts.id callback). We verify it
// server-side against Google's public keys before trusting anything in it.
authRouter.post('/google', async (req, res, next) => {
  try {
    if (!googleClient) {
      return res.status(503).json({
        success: false,
        message: 'Google login is not configured on this server.'
      });
    }

    const credential = typeof req.body?.credential === 'string' ? req.body.credential : '';
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Missing Google credential' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired Google credential' });
    }

    if (!payload?.email) {
      return res.status(401).json({ success: false, message: 'Google account has no email' });
    }
    if (!payload.email_verified) {
      return res.status(401).json({ success: false, message: 'Google email is not verified' });
    }

    const email = payload.email.trim().toLowerCase();
    const googleId = payload.sub;

    // 1) Already linked to this Google account
    let user = await UserModel.findOne({ googleId });

    // 2) Not linked yet, but an account with this email already exists
    //    (e.g. they originally signed up with email+password) — link it
    //    rather than creating a duplicate account.
    if (!user) {
      user = await UserModel.findOne({ email });
      if (user && !user.googleId) {
        user.googleId = googleId;
        if (!user.avatarUrl && payload.picture) user.avatarUrl = payload.picture;
        await user.save();
      }
    }

    // 3) Brand new user
    if (!user) {
      user = await UserModel.create({
        fullName: payload.name || email.split('@')[0],
        email,
        authProvider: 'google',
        googleId,
        avatarUrl: payload.picture
      });
    }

    const token = signAuthToken({ userId: user.id, email: user.email });
    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          readinessScore: user.readinessScore,
          streakDays: user.streakDays
        }
      }
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }
    next(err);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const validationError = validateLoginInput(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;
    const user = await UserModel.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signAuthToken({ userId: user.id, email: user.email });
    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          readinessScore: user.readinessScore,
          streakDays: user.streakDays
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.auth?.userId).lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          readinessScore: user.readinessScore,
          streakDays: user.streakDays,
          targetRole: user.targetRole || '',
          graduationYear: user.graduationYear || '',
          authProvider: user.authProvider || 'local'
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile — Update user target role, full name, graduation year
authRouter.put('/profile', requireAuth, async (req, res, next) => {
  try {
    const { fullName, targetRole, graduationYear } = req.body ?? {};
    const userId = req.auth.userId;

    const updates = {};
    if (typeof fullName === 'string') updates.fullName = fullName.trim();
    if (typeof targetRole === 'string') updates.targetRole = targetRole.trim();
    if (typeof graduationYear === 'string') updates.graduationYear = graduationYear.trim();

    const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: updates }, { new: true }).lean();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id.toString(),
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          avatarUrl: updatedUser.avatarUrl,
          readinessScore: updatedUser.readinessScore,
          streakDays: updatedUser.streakDays,
          targetRole: updatedUser.targetRole || '',
          graduationYear: updatedUser.graduationYear || '',
          authProvider: updatedUser.authProvider
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/change-password — Update password for local accounts
authRouter.put('/change-password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body ?? {};
    const userId = req.auth.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.authProvider === 'google') {
      return res.status(400).json({ success: false, message: 'Google accounts cannot change password here' });
    }

    const { bcryptCompare, bcryptHash } = await import('../lib/auth.js');
    const matches = await bcryptCompare(currentPassword || '', user.passwordHash);
    if (!matches) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.passwordHash = await bcryptHash(newPassword);
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/dashboard-stats — real stats for dashboard home
authRouter.get('/dashboard-stats', requireAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { UserSubmissionModel } = await import('../models/UserSubmission.js');
    const { DSAProblemModel } = await import('../models/DSAProblem.js');
    const { ProblemModel } = await import('../models/Problem.js');
    const { TopicModel } = await import('../models/Topic.js');
    const { UserProgressModel } = await import('../models/UserProgress.js');
    const { ContestModel } = await import('../models/Contest.js');
    const { ContestAttemptModel } = await import('../models/ContestAttempt.js');

    const { AISessionModel } = await import('../models/AISession.js');

    const APTITUDE_CATEGORIES = ['Quant', 'Logical', 'Verbal'];
    const CORE_CATEGORIES = ['OS', 'DBMS', 'CN', 'OOPS'];

    const [
      allTopics,
      dsaAcceptedIds,
      dsaTotal,
      allSubmissions,
      contestTotal,
      contestAttempts,
      aiSessions,
    ] = await Promise.all([
      TopicModel.find({}, { _id: 1, category: 1 }).lean(),
      UserSubmissionModel.distinct('problemId', { userId, status: 'Accepted' }),
      DSAProblemModel.countDocuments(),
      UserSubmissionModel.find({ userId }, { createdAt: 1 }).lean(),
      ContestModel.countDocuments({ isActive: true }),
      ContestAttemptModel.find(
        { userId, status: { $in: ['submitted', 'timed-out'] } },
        { score: 1, totalMarks: 1, startedAt: 1, submittedAt: 1 }
      ).lean(),
      AISessionModel.find({ userId }, { createdAt: 1, updatedAt: 1 }).lean(),
    ]);

    const aptitudeTopicIds = allTopics.filter(t => APTITUDE_CATEGORIES.includes(t.category)).map(t => t._id);
    const coreTopicIds = allTopics.filter(t => CORE_CATEGORIES.includes(t.category)).map(t => t._id);

    const [aptitudeProblems, coreProblems, progressRows] = await Promise.all([
      ProblemModel.find({ topicId: { $in: aptitudeTopicIds } }, { _id: 1 }).lean(),
      ProblemModel.find({ topicId: { $in: coreTopicIds } }, { _id: 1 }).lean(),
      UserProgressModel.find({ userId, isSolved: true }, { problemId: 1, updatedAt: 1 }).lean(),
    ]);

    const aptitudeProblemIdSet = new Set(aptitudeProblems.map(p => p._id.toString()));
    const coreProblemIdSet = new Set(coreProblems.map(p => p._id.toString()));

    const solvedAptitudeIds = progressRows.filter(r => aptitudeProblemIdSet.has(r.problemId.toString()));
    const solvedCoreIds = progressRows.filter(r => coreProblemIdSet.has(r.problemId.toString()));

    const aptitudeSolved = solvedAptitudeIds.length;
    const aptitudeTotal = aptitudeProblems.length;
    const aptitudePercent = aptitudeTotal > 0 ? Math.round((aptitudeSolved / aptitudeTotal) * 100) : 0;

    const coreSolved = solvedCoreIds.length;
    const coreTotal = coreProblems.length;
    const corePercent = coreTotal > 0 ? Math.round((coreSolved / coreTotal) * 100) : 0;

    const dsaSolved = dsaAcceptedIds.length;
    const dsaPercent = dsaTotal > 0 ? Math.round((dsaSolved / dsaTotal) * 100) : 0;

    const contestAttemptedCount = contestAttempts.length;
    const contestAvgPercent = contestAttemptedCount > 0
      ? Math.round(
          contestAttempts.reduce((sum, a) => sum + (a.totalMarks > 0 ? (a.score / a.totalMarks) * 100 : 0), 0)
          / contestAttemptedCount
        )
      : 0;

    // Readiness: equal-weight average across the 4 modules. A module the
    // user hasn't touched contributes 0 — that's a real gap, not a bug.
    const readinessScore = Math.round((aptitudePercent + corePercent + dsaPercent + contestAvgPercent) / 4);

    // ── Real activity heatmap + streak, built from actual timestamps ──
    const dayKey = (d) => new Date(d).toISOString().slice(0, 10); // 'YYYY-MM-DD' (UTC)

    const activityCounts = new Map();
    const bump = (d) => {
      if (!d) return;
      const key = dayKey(d);
      activityCounts.set(key, (activityCounts.get(key) || 0) + 1);
    };

    for (const row of progressRows) bump(row.updatedAt);
    for (const sub of allSubmissions) bump(sub.createdAt);
    for (const attempt of contestAttempts) { bump(attempt.startedAt); bump(attempt.submittedAt); }
    for (const session of aiSessions) { bump(session.createdAt); bump(session.updatedAt); }

    const DAYS = 182; // 26 weeks, matches the frontend grid
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const heatmapLevels = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() - i);
      const count = activityCounts.get(dayKey(d)) || 0;
      const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 7 ? 3 : 4;
      heatmapLevels.push(level);
    }

    // Streak: consecutive days with activity, counting backward from today.
    // If today has no activity yet (day isn't over), start counting from
    // yesterday instead so an in-progress streak doesn't look broken.
    let streakDays = 0;
    let cursor = new Date(today);
    if (!activityCounts.get(dayKey(cursor))) {
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    while (activityCounts.get(dayKey(cursor))) {
      streakDays++;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    return res.json({
      success: true,
      data: {
        readinessScore,
        streakDays,
        heatmap: heatmapLevels,
        modules: {
          aptitude: { solved: aptitudeSolved, total: aptitudeTotal, percent: aptitudePercent },
          core:     { solved: coreSolved, total: coreTotal, percent: corePercent },
          dsa:      { solved: dsaSolved, total: dsaTotal, percent: dsaPercent },
          contests: { attempted: contestAttemptedCount, total: contestTotal, avgPercent: contestAvgPercent },
        },
        // kept for backward compatibility with any other consumer of this endpoint
        dsaSolved, dsaTotal, dsaPercent,
      }
    });
  } catch (err) {
    next(err);
  }
});