import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type {
  Client,
  ContextProfile,
  Session,
  ApiToken,
  ContextResponse,
  NewTokenResponse,
} from '@/types'

// ── Clients ──────────────────────────────────────────────────────────────────

export function useClients() {
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => api.get('/clients').then((r) => r.data),
  })
}

export function useClient(id: string) {
  return useQuery<Client>({
    queryKey: ['clients', id],
    queryFn: () => api.get(`/clients/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation<Client, Error, Partial<Client>>({
    mutationFn: (data) => api.post('/clients', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useUpdateClient(id: string) {
  const qc = useQueryClient()
  return useMutation<Client, Error, Partial<Client>>({
    mutationFn: (data) => api.patch(`/clients/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] })
      qc.invalidateQueries({ queryKey: ['clients', id] })
    },
  })
}

export function useDeleteClient() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/clients/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}

// ── Context Profile ───────────────────────────────────────────────────────────

export function useClientProfile(clientId: string) {
  return useQuery<ContextProfile>({
    queryKey: ['clients', clientId, 'profile'],
    queryFn: () => api.get(`/clients/${clientId}/profile`).then((r) => r.data),
    enabled: !!clientId,
  })
}

export function useUpsertProfile(clientId: string) {
  const qc = useQueryClient()
  return useMutation<ContextProfile, Error, Partial<ContextProfile>>({
    mutationFn: (data) =>
      api.put(`/clients/${clientId}/profile`, data).then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['clients', clientId, 'profile'] }),
  })
}

// ── Context (copy-to-clipboard) ───────────────────────────────────────────────

export function useContextBySlug(slug: string) {
  return useQuery<ContextResponse>({
    queryKey: ['context', slug],
    queryFn: () => api.get(`/context/${slug}`).then((r) => r.data),
    enabled: false, // only fetch on demand
  })
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export function useSessions(clientId: string) {
  return useQuery<Session[]>({
    queryKey: ['clients', clientId, 'sessions'],
    queryFn: () => api.get(`/clients/${clientId}/sessions`).then((r) => r.data),
    enabled: !!clientId,
  })
}

export function useCreateSession(clientId: string) {
  const qc = useQueryClient()
  return useMutation<Session, Error, Partial<Session>>({
    mutationFn: (data) =>
      api.post(`/clients/${clientId}/sessions`, data).then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['clients', clientId, 'sessions'] }),
  })
}

export function useUpdateSession() {
  const qc = useQueryClient()
  return useMutation<Session, Error, { id: string; clientId: string; data: Partial<Session> }>({
    mutationFn: ({ id, data }) =>
      api.patch(`/sessions/${id}`, data).then((r) => r.data),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ['clients', vars.clientId, 'sessions'] }),
  })
}

// ── API Tokens ────────────────────────────────────────────────────────────────

export function useApiTokens() {
  return useQuery<ApiToken[]>({
    queryKey: ['tokens'],
    queryFn: () => api.get('/tokens').then((r) => r.data),
  })
}

export function useCreateToken() {
  const qc = useQueryClient()
  return useMutation<NewTokenResponse, Error, { label: string }>({
    mutationFn: (data) => api.post('/tokens', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tokens'] }),
  })
}

export function useDeleteToken() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/tokens/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tokens'] }),
  })
}
