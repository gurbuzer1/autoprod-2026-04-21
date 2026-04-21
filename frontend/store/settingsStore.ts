import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  apiBaseURL: string
  authToken: string | null
  setApiBaseURL: (url: string) => void
  setAuthToken: (token: string | null) => void
  clearAuth: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiBaseURL: 'http://localhost:4000/api/v1',
      authToken: null,
      setApiBaseURL: (url: string) => set({ apiBaseURL: url }),
      setAuthToken: (token: string | null) => set({ authToken: token }),
      clearAuth: () => set({ authToken: null }),
    }),
    {
      name: 'contextvault-settings',
    }
  )
)
