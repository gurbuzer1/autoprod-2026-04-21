import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import db from '../db/client';
import { requireAuth, signJwt } from '../middleware/auth';
import type { User } from '../types';

const router = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', async (req: Request, res: Response) => {
  const body = RegisterSchema.parse(req.body);

  const existing = db
    .prepare<[string], User>('SELECT id FROM users WHERE email = ?')
    .get(body.email);

  if (existing) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const password_hash = await bcrypt.hash(body.password, 12);
  const id = crypto.randomUUID();
  const now = Date.now();

  db.prepare(
    `INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, body.email, password_hash, body.name, now, now);

  const token = signJwt(id, body.email);

  res.status(201).json({
    user: { id, email: body.email, name: body.name },
    token,
  });
});

router.post('/login', async (req: Request, res: Response) => {
  const body = LoginSchema.parse(req.body);

  const user = db
    .prepare<[string], User>('SELECT * FROM users WHERE email = ?')
    .get(body.email);

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(body.password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signJwt(user.id, user.email);

  res.json({
    user: { id: user.id, email: user.email, name: user.name },
    token,
  });
});

router.get('/me', requireAuth, (req: Request, res: Response) => {
  const user = db
    .prepare<[string], User>('SELECT id, email, name FROM users WHERE id = ?')
    .get(req.userId!);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ id: user.id, email: user.email, name: user.name });
});

export default router;
