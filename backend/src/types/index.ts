export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: number;
  updated_at: number;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  industry: string | null;
  status: string;
  created_at: number;
  updated_at: number;
}

export interface ContextProfile {
  id: string;
  client_id: string;
  brand_voice: string;
  target_audience: string;
  constraints: string; // JSON array stored as TEXT
  tone_examples: string; // JSON array stored as TEXT
  project_status: string;
  background: string;
  custom_fields: string; // JSON object stored as TEXT
  version: number;
  updated_at: number;
}

export interface Session {
  id: string;
  client_id: string;
  user_id: string;
  tool_name: string;
  started_at: number;
  ended_at: number | null;
  summary: string;
  raw_notes: string;
  status: string;
}

export interface ApiToken {
  id: string;
  user_id: string;
  token_hash: string;
  label: string;
  last_used_at: number | null;
  created_at: number;
  expires_at: number | null;
}

// Augment Express Request to carry authenticated user
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}
