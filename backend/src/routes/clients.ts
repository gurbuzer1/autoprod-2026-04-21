import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import db from '../db/client';
import { requireAuth } from '../middleware/auth';
import type { Client } from '../types';

const router = Router();

router.use(requireAuth);

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const suffix = crypto.randomUUID().slice(0, 4);
  return `${base}-${suffix}`;
}

const CreateClientSchema = z.object({
  name: z.string().min(1).max(200),
  industry: z.string().max(100).optional(),
});

const UpdateClientSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  industry: z.string().max(100).optional(),
  status: z.enum(['active', 'archived']).optional(),
});

router.get('/', (req: Request, res: Response) => {
  const clients = db
    .prepare<[string], Client>(
      `SELECT * FROM clients WHERE user_id = ? AND status != 'archived' ORDER BY created_at DESC`
    )
    .all(req.userId!);

  res.json({ clients });
});

router.post('/', (req: Request, res: Response) => {
  const body = CreateClientSchema.parse(req.body);

  const id = crypto.randomUUID();
  const slug = generateSlug(body.name);
  const now = Date.now();

  db.prepare(
    `INSERT INTO clients (id, user_id, name, slug, industry, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`
  ).run(id, req.userId!, body.name, slug, body.industry ?? null, now, now);

  // Create default context profile
  const profileId = crypto.randomUUID();
  db.prepare(
    `INSERT INTO context_profiles (id, client_id, updated_at)
     VALUES (?, ?, ?)`
  ).run(profileId, id, now);

  const client = db
    .prepare<[string], Client>('SELECT * FROM clients WHERE id = ?')
    .get(id);

  res.status(201).json({ client });
});

router.get('/:id', (req: Request, res: Response) => {
  const clientId = req.params.id as string;
  const client = db
    .prepare<[string, string], Client>(
      'SELECT * FROM clients WHERE id = ? AND user_id = ?'
    )
    .get(clientId, req.userId!);

  if (!client) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }

  res.json({ client });
});

router.patch('/:id', (req: Request, res: Response) => {
  const clientId = req.params.id as string;
  const client = db
    .prepare<[string, string], Client>(
      'SELECT * FROM clients WHERE id = ? AND user_id = ?'
    )
    .get(clientId, req.userId!);

  if (!client) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }

  const body = UpdateClientSchema.parse(req.body);
  const now = Date.now();

  const updates: Record<string, unknown> = { updated_at: now };
  if (body.name !== undefined) updates.name = body.name;
  if (body.industry !== undefined) updates.industry = body.industry;
  if (body.status !== undefined) updates.status = body.status;

  const setClauses = Object.keys(updates)
    .map((k) => `${k} = ?`)
    .join(', ');
  const values = [...Object.values(updates), clientId, req.userId!];

  db.prepare(
    `UPDATE clients SET ${setClauses} WHERE id = ? AND user_id = ?`
  ).run(...values);

  const updated = db
    .prepare<[string], Client>('SELECT * FROM clients WHERE id = ?')
    .get(clientId);

  res.json({ client: updated });
});

router.delete('/:id', (req: Request, res: Response) => {
  const clientId = req.params.id as string;
  const client = db
    .prepare<[string, string], Client>(
      'SELECT * FROM clients WHERE id = ? AND user_id = ?'
    )
    .get(clientId, req.userId!);

  if (!client) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }

  db.prepare(
    `UPDATE clients SET status = 'archived', updated_at = ? WHERE id = ?`
  ).run(Date.now(), clientId);

  res.json({ success: true });
});

export default router;
