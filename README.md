# ContextVault — Your clients, pre-loaded.

> Auto-generated MVP scaffold | Created: 2026-04-21

## What is it?

ContextVault is a client context manager for freelance consultants. It eliminates the 10-minute AI re-briefing tax by instantly loading the right project background, tone constraints, and session history into any MCP-compatible AI tool (Claude, Cursor, etc.) the moment you start working.

**Target user**: Freelancers managing 5-20 active clients who switch between AI sessions multiple times per day.

**Core problem**: Every AI session starts with amnesia. Freelancers paste the same client briefs over and over. Context bleeds between clients. ContextVault fixes this with a persistent, client-isolated memory layer.

## MVP Features

1. **Client Context Profiles** — Web UI to build per-client profiles: brand voice, audience, constraints, project status, tone examples.
2. **One-Click Context Copy (MCP-ready)** — Copy a pre-formatted context block to clipboard with one click, or load it via the local MCP server into Claude/Cursor automatically.
3. **Session Memory Capture** — After AI sessions, capture key decisions and save them back to the client profile.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) + Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express 5 + TypeScript |
| Database | SQLite (better-sqlite3) |
| MCP Server | @modelcontextprotocol/sdk (TypeScript) |
| State (FE) | Zustand v5 + React Query v5 |
| Auth | JWT (7-day) + API tokens (hashed, `cvt_` prefix) |

## Project Structure

```
contextvault/
├── backend/          # Express 5 REST API (Node.js + TypeScript)
├── mcp-server/       # Local MCP server for AI tool integration
└── frontend/         # Next.js 15 web app
```

## How to Run

### Prerequisites
- Node.js 22+
- npm 10+

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set JWT_SECRET to a random string
npm run dev
# API running at http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:3000
```

### MCP Server

```bash
cd mcp-server
npm install
npm run build
# Configure with your API token from Settings page:
node dist/cli.js configure --token cvt_YOUR_TOKEN --url http://localhost:3001
# Register in Claude Desktop / Cursor mcpServers config:
# { "command": "node", "args": ["/path/to/mcp-server/dist/index.js"] }
```

## Why Now (April 2026)

- MCP reached 97M SDK downloads — it's now the universal AI tool integration layer
- 92% of US developers use AI tools daily; freelance AI skill demand grew 109% YoY
- No dominant product owns "AI context for client workers" yet
- The AI agent memory market is $6.27B in 2026, growing to $28.45B by 2030
