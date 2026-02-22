import { registerRoutes } from '../server/routes';
import express from 'express';
import { createServer } from 'http';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mocking storage or ensuring it's initialized if needed
// For Vercel, you'll need a persistent DB like the Replit Postgres or similar.
// The current setup uses a Neon-backed Postgres which should work if DATABASE_URL is set in Vercel.

(async () => {
  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);
})();

export default app;
