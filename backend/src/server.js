import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env, validateEnvironment } from './config/env.js';
import { ensureDefaultAdmin } from './services/adminBootstrapService.js';

const start = async () => {
  validateEnvironment();
  await connectDatabase(env.mongodbUri);
  const admin = await ensureDefaultAdmin();
  console.info(`${admin.created ? 'Created' : 'Found'} administrator account for ${admin.email}.`);
  const server = createApp().listen(env.port, () => console.info(`API listening on http://localhost:${env.port}`));
  const shutdown = (signal) => {
    console.info(`${signal} received; shutting down.`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start().catch((error) => {
  console.error('Backend startup failed:', error.message);
  process.exit(1);
});
