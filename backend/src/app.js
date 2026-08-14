import cors from 'cors';
import express from 'express';
import { aiSuiteRouter } from './routes/aiSuite.js';
import { contestsRouter } from './routes/contests.js';
import { aptitudeRouter } from './routes/aptitude.js';
import { coreSubjectsRouter } from './routes/coreSubjects.js';
import { authRouter } from './routes/auth.js';
import { dsaRouter } from './routes/dsa.js';
import { healthRouter } from './routes/health.js';
import { publicRouter } from './routes/public.js';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ success: true, message: 'PrepMatrix AI API is running' });
  });

  app.use('/api/health', healthRouter);
  app.use('/api/public', publicRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/aptitude', aptitudeRouter);
  app.use('/api/core-subjects', coreSubjectsRouter);
  app.use('/api/dsa', dsaRouter);
  app.use('/api/ai-suite', aiSuiteRouter);
  app.use('/api/contests', contestsRouter);

  // 404 for unknown API routes
  app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // Global error handler — MUST be last. Catches every error passed via
  // next(err) from any route, plus Mongoose CastErrors (e.g. malformed
  // ObjectId in a URL) and duplicate-key errors, so the process never
  // crashes from an unhandled rejection — it just returns a clean JSON error.
  app.use((err, _req, res, _next) => {
    console.error('[API Error]', err);

    if (err?.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: 'Duplicate record — this already exists' });
    }
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  });

  return app;
};