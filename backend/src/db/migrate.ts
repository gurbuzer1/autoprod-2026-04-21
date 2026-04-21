import db from './client';

export function runMigrations(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      industry TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      UNIQUE(user_id, slug)
    );

    CREATE TABLE IF NOT EXISTS context_profiles (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL UNIQUE REFERENCES clients(id),
      brand_voice TEXT NOT NULL DEFAULT '',
      target_audience TEXT NOT NULL DEFAULT '',
      constraints TEXT NOT NULL DEFAULT '[]',
      tone_examples TEXT NOT NULL DEFAULT '[]',
      project_status TEXT NOT NULL DEFAULT '',
      background TEXT NOT NULL DEFAULT '',
      custom_fields TEXT NOT NULL DEFAULT '{}',
      version INTEGER NOT NULL DEFAULT 1,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      tool_name TEXT NOT NULL DEFAULT 'claude',
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      summary TEXT NOT NULL DEFAULT '',
      raw_notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS api_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      token_hash TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL,
      last_used_at INTEGER,
      created_at INTEGER NOT NULL,
      expires_at INTEGER
    );
  `);

  console.log('[db] Migrations complete');
}
