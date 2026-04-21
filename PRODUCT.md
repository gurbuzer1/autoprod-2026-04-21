# ContextVault — Full Product Specification

Generated: 2026-04-21

## Idea

### Product Name
ContextVault

### One-liner
ContextVault is a client context manager that instantly loads the right project background, tone, constraints, and history into any AI tool the moment you start working — eliminating the 10-minute re-briefing tax freelancers pay every time they switch clients.

### Target User
Freelance consultants and solo agency operators managing 5-20 active clients — specifically writers, designers, strategists, marketers, and developers who use Claude, ChatGPT, Cursor, or similar AI tools daily and context-switch between clients multiple times per day.

### Core Problem
Every AI session starts with amnesia. Freelancers spend 5-15 minutes re-establishing context for each client before AI output becomes usable. Context bleeds between clients. There is no product that acts as a persistent, client-isolated memory layer that injects the right context automatically across multiple AI tools.

### 3 MVP Features
1. Client Context Profiles: structured web UI per client (brand voice, audience, constraints, project status, tone examples)
2. One-Click Context Injection: clipboard copy + local MCP server that loads context into Claude/Cursor
3. Session Memory Capture: capture key decisions after AI sessions, save back to profile

### Tech Stack
- Frontend: Next.js 15 + Tailwind + shadcn/ui
- Backend: Node.js + Express 5 + TypeScript + SQLite (better-sqlite3)
- MCP Server: @modelcontextprotocol/sdk TypeScript
- Auth: JWT + API tokens

### Why-Now Rationale
MCP reached 97M downloads and is now the universal AI tool plug. The AI-first work revolution is mature (92% developer adoption). No dominant product owns "AI context for freelancers" yet. Window is open in April 2026.

### Market Size Signal
59M freelancers in the US; ~15M AI-active knowledge workers. $12/mo subscription. $6.27B AI agent memory market growing at 35% CAGR.

---

## Backend Plan (Corrected)

### Data Model (5 tables)

**users**: id (UUID), email (UNIQUE), password_hash, name, created_at, updated_at

**clients**: id, user_id (FK), name, slug (UNIQUE per user), industry, status (active/paused/archived), created_at, updated_at
- slug auto-generated server-side as kebab-case name + short random suffix

**context_profiles**: id, client_id (FK, UNIQUE), brand_voice, target_audience, constraints (JSON array), tone_examples (JSON array), project_status, background, custom_fields (JSON object), version, updated_at

**sessions**: id, client_id (FK), user_id (FK), tool_name, started_at, ended_at, summary, raw_notes, status (active/completed)

**api_tokens**: id, user_id (FK), token_hash (SHA-256), label, last_used_at, created_at, expires_at

### Key API Endpoints (corrected)

Auth: POST /api/v1/auth/register, POST /api/v1/auth/login, GET /api/v1/auth/me
Clients: GET/POST /api/v1/clients, GET/PATCH/DELETE /api/v1/clients/:id
Profiles: GET/PUT /api/v1/clients/:id/profile
Context export: GET /api/v1/context/:slug (returns { context_text } — used by MCP server and clipboard copy)
Sessions: GET/POST /api/v1/clients/:id/sessions (NESTED — matches FE), GET/PATCH /api/v1/sessions/:id
Tokens: GET/POST/DELETE /api/v1/tokens, DELETE /api/v1/tokens/:id

### Auth Strategy
- JWT (HS256, 7-day expiry) for browser sessions
- API tokens (cvt_ prefix, SHA-256 hashed) for MCP server
- CORS: allow http://localhost:3000

### MCP Server Tools
- load_client_context: calls GET /api/v1/context/:slug, returns formatted markdown
- list_clients: calls GET /api/v1/clients
- save_session_note: creates a session + note in one call
- All tools use server.registerTool() (not deprecated .tool())

### Key Dependencies (corrected versions)
- express@^5.0.0 (native async error handling)
- better-sqlite3@^9.4.3
- bcryptjs@^2.4.3
- jsonwebtoken@^9.0.2
- zod@^3.25.0 (required by @modelcontextprotocol/sdk)
- @modelcontextprotocol/sdk@^1.10.1
- cors@^2.8.5, helmet@^7.1.0, dotenv@^16.4.5
- No uuid package — use crypto.randomUUID()

---

## Frontend Plan (Corrected)

### Pages
- / — Dashboard: client grid with "Copy Context" buttons
- /clients/new — Create client profile
- /clients/[id] — View/edit client profile
- /clients/[id]/sessions — Session memory log
- /settings — MCP config + API base URL + API token management

### Key Corrections Applied
- Removed POST /mcp/inject (doesn't exist) — replaced with GET /api/v1/context/:slug for clipboard copy
- Added layout.tsx with QueryClientProvider + Toaster (required for React Query and sonner)
- Added API token management section to /settings page
- Sessions calls use nested URL: GET/POST /api/v1/clients/:id/sessions

### State
- Zustand v5 (settingsStore persisted to localStorage, clientStore)
- React Query v5 (clients, client, sessions queries)
- useState for form/modal local state

### Key Dependencies (corrected versions)
- next@15.x, react@19.x
- @tanstack/react-query@^5.0.0
- zustand@^5.0.0
- axios@^1.x
- sonner@^1.x

---

## Validator Corrections Applied

1. CRITICAL: Removed /mcp/inject — replaced with clipboard-copy via GET /api/v1/context/:slug
2. CRITICAL: Fixed sessions URL to nested /api/v1/clients/:id/sessions
3. CRITICAL: Upgraded zod to ^3.25.0 (required by MCP SDK)
4. MAJOR: Added PATCH /api/v1/sessions/:id endpoint
5. MAJOR: Added API token management UI to /settings page
6. MAJOR: Added layout.tsx with QueryClientProvider + Toaster
7. MAJOR: Changed MCP tool registration to server.registerTool() (not deprecated .tool())
8. MAJOR: Added CORS middleware to backend
9. MINOR: Removed mcp-server/src/resources/ (out of scope for MVP)
10. MINOR: Auto-generate slug server-side with kebab-case + random suffix
11. MINOR: Using crypto.randomUUID() instead of uuid package
12. MINOR: Upgraded express to v5, zustand to v5
