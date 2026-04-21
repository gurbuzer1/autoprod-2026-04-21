import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import db from '../db/client';
import { requireAuth } from '../middleware/auth';
import type { ApiToken } from '../types';

const router = Router();

router.use(requireAuth);

const CreateTokenSchema = z.object({
  label: z.string().min(1).max(100),
  expires_at: z.number().optional(),
});

router.get('/', (req: Request, res: Response) => {
  const tokens = db
    .prepare<
      [string],
      Omit<ApiToken, 'token_hash'>
    >(
      `SELECT id, user_id, label, last_used_at, created_at, expires_at
       FROM api_tokens WHERE user_id = ? ORDER BY created_at DESC`
    )
    .all(req.userId!);

  res.json({ tokens });
});

router.post('/', (req: Request, res: Response) => {
  const body = CreateTokenSchema.parse(req.body);

  // Generate: "cvt_" + 64 hex chars from 32 random bytes
  const rawBytes = crypto.randomBytes(32).toString('hex');
  const rawToken = `cvt_${rawBytes}`;
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const id = crypto.randomUUID();
  const now = Date.now();

  db.prepare(
    `INSERT INTO api_tokens (id, user_id, token_hash, label, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, req.userId!, tokenHash, body.label, now, body.expires_at ?? null);

  res.status(201).json({
    id,
    label: body.label,
    created_at: now,
    expires_at: body.expires_at ?? null,
    token: rawToken, // only returned once
  });
});

router.delete('/:id', (req: Request, res: Response) => {
  const tokenId = req.params.id as string;
  const token = db
    .prepare<[string, string], ApiToken>(
      'SELECT id FROM api_tokens WHERE id = ? AND user_id = ?'
    )
    .get(tokenId, req.userId!);

  if (!token) {
    res.status(404).json({ error: 'Token not found' });
    return;
  }

  db.prepare('DELETE FROM api_tokens WHERE id = ?').run(tokenId);

  res.json({ success: true });
});

export default router;
