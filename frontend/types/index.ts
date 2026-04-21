export interface User {
  id: string
  email: string
  name: string
}

export interface Client {
  id: string
  name: string
  slug: string
  industry: string | null
  status: 'active' | 'paused' | 'archived'
  created_at: number
  updated_at: number
}

export interface ContextProfile {
  id: string
  client_id: string
  brand_voice: string
  target_audience: string
  constraints: string[]
  tone_examples: string[]
  project_status: string
  background: string
  version: number
  updated_at: number
}

export interface Session {
  id: string
  client_id: string
  tool_name: string
  started_at: number
  ended_at: number | null
  summary: string
  raw_notes: string
  status: 'active' | 'completed'
}

export interface ApiToken {
  id: string
  label: string
  last_used_at: number | null
  created_at: number
}

export interface ContextResponse {
  client: Client
  profile: ContextProfile
  context_text: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface NewTokenResponse {
  id: string
  label: string
  token: string
}
