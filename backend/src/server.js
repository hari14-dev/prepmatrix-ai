import mongoose from 'mongoose';
import { createApp } from './app.js';
import { env } from './config/env.js';

// Safety net: prevent the whole server from crashing if any route handler
// (in any router — not just contests) throws or rejects without its own
// try/catch. Without this, Node kills the entire process on an unhandled
// promise rejection, taking down every user's connection, not just the
// one bad request.
process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err);
});

const start = async () => {
  await mongoose.connect(env.MONGODB_URI);

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`SP3 API listening on http://localhost:${env.PORT}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});