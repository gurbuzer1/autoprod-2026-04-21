import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ZodError } from 'zod';

import { runMigrations } from './db/migrate';
import authRouter from './routes/auth';
import clientsRouter from './routes/clients';
import profilesRouter from './routes/profiles';
import sessionsRouter from './routes/sessions';
import tokensRouter from './routes/tokens';

const app = express();
const PORT = parseInt(process.env.PORT ?? '4000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';

// Core middleware
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: Date.now() });
});

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/clients', clientsRouter);
app.use('/api/v1', profilesRouter);   // handles /api/v1/clients/:id/profile and /api/v1/context/:slug
app.use('/api/v1', sessionsRouter);   // handles /api/v1/clients/:id/sessions and /api/v1/sessions/:id
app.use('/api/v1/tokens', tokensRouter);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler — Express 5 forwards async throws here automatically
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation error', issues: err.issues });
    return;
  }

  if (err instanceof Error) {
    console.error('[error]', err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  console.error('[error] unknown', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Run migrations then start
runMigrations();

app.listen(PORT, () => {
  console.log(`[server] ContextVault backend running on http://localhost:${PORT}`);
});

export default app;
