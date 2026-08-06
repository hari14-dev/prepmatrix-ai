import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({ success: true, service: 'sp3-api', status: 'ok' });
});
