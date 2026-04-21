import { Router, Request, Response } from 'express';
import { z } from 'zod';
import db from '../db/client';
import { requireAuth } from '../middleware/auth';
import { buildContextText } from '../services/contextFormatter';
import type { Client, ContextProfile } from '../types';

const router = Router();

const UpdateProfileSchema = z.object({
  brand_voice: z.string().optional(),
  target_audience: z.string().optional(),
  constraints: z.array(z.string()).optional(),
  tone_examples: z.array(z.string()).optional(),
  project_status: z.string().optional(),
  background: z.string().optional(),
});

function getClientForUser(clientId: string, userId: string): Client | undefined {
  return db
    .prepare<[string, string], Client>(
      'SELECT * FROM clients WHERE id = ? AND user_id = ?'
    )
    .get(clientId, userId);
}

// GET /api/v1/clients/:id/profile
router.get('/clients/:id/profile', requireAuth, (req: Request, res: Response) => {
  const clientId = req.params.id as string;
  const client = getClientForUser(clientId, req.userId!);
  if (!client) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }

  const profile = db
    .prepare<[string], ContextProfile>(
      'SELECT * FROM context_profiles WHERE client_id = ?'
    )
    .get(clientId);

  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }

  res.json({
    profile: {
      ...profile,
      constraints: JSON.parse(profile.constraints),
      tone_examples: JSON.parse(profile.tone_examples),
      custom_fields: JSON.parse(profile.custom_fields),
    },
  });
});

// PUT /api/v1/clients/:id/profile
router.put('/clients/:id/profile', requireAuth, (req: Request, res: Response) => {
  const clientId = req.params.id as string;
  const client = getClientForUser(clientId, req.userId!);
  if (!client) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }

  const body = UpdateProfileSchema.parse(req.body);
  const now = Date.now();

  const profile = db
    .prepare<[string], ContextProfile>(
      'SELECT * FROM context_profiles WHERE client_id = ?'
    )
    .get(clientId);

  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }

  const updates: Record<string, unknown> = { updated_at: now, version: profile.version + 1 };
  if (body.brand_voice !== undefined) updates.brand_voice = body.brand_voice;
  if (body.target_audience !== undefined) updates.target_audience = body.target_audience;
  if (body.constraints !== undefined) updates.constraints = JSON.stringify(body.constraints);
  if (body.tone_examples !== undefined) updates.tone_examples = JSON.stringify(body.tone_examples);
  if (body.project_status !== undefined) updates.project_status = body.project_status;
  if (body.background !== undefined) updates.background = body.background;

  const setClauses = Object.keys(updates)
    .map((k) => `${k} = ?`)
    .join(', ');
  const values = [...Object.values(updates), clientId];

  db.prepare(
    `UPDATE context_profiles SET ${setClauses} WHERE client_id = ?`
  ).run(...values);

  const updated = db
    .prepare<[string], ContextProfile>(
      'SELECT * FROM context_profiles WHERE client_id = ?'
    )
    .get(clientId);

  res.json({
    profile: {
      ...updated!,
      constraints: JSON.parse(updated!.constraints),
      tone_examples: JSON.parse(updated!.tone_examples),
      custom_fields: JSON.parse(updated!.custom_fields),
    },
  });
});

// GET /api/v1/context/:slug — accepts JWT or API token
router.get('/context/:slug', requireAuth, (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const client = db
    .prepare<[string, string], Client>(
      'SELECT * FROM clients WHERE slug = ? AND user_id = ?'
    )
    .get(slug, req.userId!);

  if (!client) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }

  const profile = db
    .prepare<[string], ContextProfile>(
      'SELECT * FROM context_profiles WHERE client_id = ?'
    )
    .get(client.id);

  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }

  const context_text = buildContextText(client, profile);

  res.json({
    client: { id: client.id, name: client.name, slug: client.slug, industry: client.industry },
    profile: {
      ...profile,
      constraints: JSON.parse(profile.constraints),
      tone_examples: JSON.parse(profile.tone_examples),
      custom_fields: JSON.parse(profile.custom_fields),
    },
    context_text,
  });
});

export default router;
