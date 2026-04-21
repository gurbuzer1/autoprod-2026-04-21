import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod/v3';
import { apiClient } from './apiClient';

const server = new McpServer({
  name: 'contextvault',
  version: '0.1.0',
});

// Tool 1: load_client_context
server.registerTool(
  'load_client_context',
  {
    description:
      'Load the full context profile for a ContextVault client by slug. Returns a pre-formatted markdown block suitable for injecting into AI prompts.',
    inputSchema: {
      slug: z.string().describe('The client slug (e.g. "acme-corp-ab12")'),
    },
  },
  async ({ slug }) => {
    const data = await apiClient.getContext(slug);
    return {
      content: [{ type: 'text' as const, text: data.context_text }],
    };
  }
);

// Tool 2: list_clients
server.registerTool(
  'list_clients',
  {
    description:
      'List all active ContextVault clients for the authenticated user. Returns name, slug, and industry for each client.',
    inputSchema: {},
  },
  async () => {
    const data = await apiClient.listClients();

    if (data.clients.length === 0) {
      return { content: [{ type: 'text' as const, text: 'No clients found.' }] };
    }

    const lines = data.clients.map((c) => {
      const industry = c.industry ? ` (${c.industry})` : '';
      return `- **${c.name}**${industry} — slug: \`${c.slug}\``;
    });

    return {
      content: [
        { type: 'text' as const, text: `## Your ContextVault Clients\n\n${lines.join('\n')}` },
      ],
    };
  }
);

// Tool 3: save_session_note
server.registerTool(
  'save_session_note',
  {
    description:
      'Save a note or summary from the current AI session to ContextVault. Associates the note with a specific client.',
    inputSchema: {
      client_id: z.string().describe('The UUID of the client to associate this session with'),
      notes: z.string().describe('The raw notes or summary from this session'),
      tool_name: z
        .string()
        .optional()
        .describe('The AI tool name (default: "claude")'),
    },
  },
  async ({ client_id, notes, tool_name }) => {
    const data = await apiClient.createSession(
      client_id,
      tool_name ?? 'claude',
      notes
    );

    return {
      content: [
        {
          type: 'text' as const,
          text: `Session saved. ID: ${data.session.id} | Status: ${data.session.status} | Started: ${new Date(data.session.started_at).toISOString()}`,
        },
      ],
    };
  }
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[mcp] ContextVault MCP server running on stdio');
}

main().catch((err: unknown) => {
  console.error('[mcp] Fatal error:', err);
  process.exit(1);
});
