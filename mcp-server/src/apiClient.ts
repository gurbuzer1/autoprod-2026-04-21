import { loadConfig } from './config';

export interface ApiClient {
  name: string;
  slug: string;
  industry: string | null;
  status: string;
}

export interface ApiContextResponse {
  client: ApiClient;
  profile: {
    brand_voice: string;
    target_audience: string;
    constraints: string[];
    tone_examples: string[];
    project_status: string;
    background: string;
  };
  context_text: string;
}

export interface ApiSession {
  id: string;
  client_id: string;
  tool_name: string;
  started_at: number;
  status: string;
  summary: string;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const config = loadConfig();

  if (!config.token) {
    throw new Error(
      'No API token configured. Set token in ~/.contextvault/config.json'
    );
  }

  const url = `${config.apiUrl}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.token}`,
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, `API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  getContext(slug: string): Promise<ApiContextResponse> {
    return request<ApiContextResponse>('GET', `/api/v1/context/${encodeURIComponent(slug)}`);
  },

  listClients(): Promise<{ clients: ApiClient[] }> {
    return request<{ clients: ApiClient[] }>('GET', '/api/v1/clients');
  },

  createSession(
    clientId: string,
    toolName: string,
    rawNotes: string
  ): Promise<{ session: ApiSession }> {
    return request<{ session: ApiSession }>(
      'POST',
      `/api/v1/clients/${encodeURIComponent(clientId)}/sessions`,
      { tool_name: toolName, raw_notes: rawNotes }
    );
  },
};
