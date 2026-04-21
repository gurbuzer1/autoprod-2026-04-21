import axios from 'axios'
import { useSettingsStore } from '@/store/settingsStore'

export const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach baseURL and auth token from store
api.interceptors.request.use((config) => {
  const { apiBaseURL, authToken } = useSettingsStore.getState()
  config.baseURL = apiBaseURL

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }

  return config
})

// Response interceptor: handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useSettingsStore.getState().clearAuth()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
