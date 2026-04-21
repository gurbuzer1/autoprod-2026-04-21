import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../db/client';
import type { ApiToken } from '../types';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';

interface JwtPayload {
  sub: string;
  email: string;
}

function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Missing authorization token' });
    return;
  }

  // API token path: starts with cvt_
  if (token.startsWith('cvt_')) {
    const hash = hashToken(token);
    const row = db
      .prepare<[string], ApiToken>(
        `SELECT * FROM api_tokens WHERE token_hash = ?`
      )
      .get(hash);

    if (!row) {
      res.status(401).json({ error: 'Invalid API token' });
      return;
    }

    if (row.expires_at && row.expires_at < Date.now()) {
      res.status(401).json({ error: 'API token expired' });
      return;
    }

    // Update last_used_at (fire and forget, sync)
    db.prepare(`UPDATE api_tokens SET last_used_at = ? WHERE id = ?`).run(Date.now(), row.id);

    req.userId = row.user_id;
    next();
    return;
  }

  // JWT path
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function signJwt(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: '7d' });
}
