import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import db from '../db/client';
import { requireAuth } from '../middleware/auth';
import type { Client, Session } from '../types';

const router = Router();

router.use(requireAuth);

const CreateSessionSchema = z.object({
  tool_name: z.string().max(100).optional(),
  raw_notes: z.string().optional(),
});

const UpdateSessionSchema = z.object({
  summary: z.string().optional(),
  raw_notes: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
  ended_at: z.number().optional(),
});

// GET /api/v1/clients/:id/sessions
router.get('/clients/:id/sessions', (req: Request, res: Response) => {
  const clientId = req.params.id as string;
  const client = db
    .prepare<[string, string], Client>(
      'SELECT id FROM clients WHERE id = ? AND user_id = ?'
    )
    .get(clientId, req.userId!);

  if (!client) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }

  const sessions = db
    .prepare<[string], Session>(
      `SELECT * FROM sessions WHERE client_id = ? ORDER BY started_at DESC`
    )
    .all(clientId);

  res.json({ sessions });
});

// POST /api/v1/clients/:id/sessions
router.post('/clients/:id/sessions', (req: Request, res: Response) => {
  const clientId = req.params.id as string;
  const client = db
    .prepare<[string, string], Client>(
      'SELECT id FROM clients WHERE id = ? AND user_id = ?'
    )
    .get(clientId, req.userId!);

  if (!client) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }

  const body = CreateSessionSchema.parse(req.body);
  const id = crypto.randomUUID();
  const now = Date.now();

  db.prepare(
    `INSERT INTO sessions (id, client_id, user_id, tool_name, started_at, raw_notes, status)
     VALUES (?, ?, ?, ?, ?, ?, 'active')`
  ).run(
    id,
    clientId,
    req.userId!,
    body.tool_name ?? 'claude',
    now,
    body.raw_notes ?? ''
  );

  const session = db
    .prepare<[string], Session>('SELECT * FROM sessions WHERE id = ?')
    .get(id);

  res.status(201).json({ session });
});

// PATCH /api/v1/sessions/:id
router.patch('/sessions/:id', (req: Request, res: Response) => {
  const sessionId = req.params.id as string;
  const session = db
    .prepare<[string, string], Session>(
      'SELECT * FROM sessions WHERE id = ? AND user_id = ?'
    )
    .get(sessionId, req.userId!);

  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  const body = UpdateSessionSchema.parse(req.body);
  const updates: Record<string, unknown> = {};

  if (body.summary !== undefined) updates.summary = body.summary;
  if (body.raw_notes !== undefined) updates.raw_notes = body.raw_notes;
  if (body.status !== undefined) updates.status = body.status;
  if (body.ended_at !== undefined) updates.ended_at = body.ended_at;

  if (Object.keys(updates).length === 0) {
    res.json({ session });
    return;
  }

  const setClauses = Object.keys(updates)
    .map((k) => `${k} = ?`)
    .join(', ');
  const values = [...Object.values(updates), sessionId];

  db.prepare(`UPDATE sessions SET ${setClauses} WHERE id = ?`).run(...values);

  const updated = db
    .prepare<[string], Session>('SELECT * FROM sessions WHERE id = ?')
    .get(sessionId);

  res.json({ session: updated });
});

export default router;
