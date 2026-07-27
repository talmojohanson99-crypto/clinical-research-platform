import { create } from 'zustand'
import api from '../api/client'

interface User {
  id: string
  username: string
  email: string
  role: string
  first_name: string
  last_name: string
}

interface AuthState {
  token: string | null
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,

  login: async (username, password) => {
    const res = await api.post('/auth/login/', { username, password })
    const { access } = res.data
    localStorage.setItem('token', access)
    set({ token: access })
  },

  register: async (data) => {
    await api.post('/auth/users/', data)
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },

  loadUser: async () => {
    try {
      const res = await api.get('/auth/users/me/')
      set({ user: res.data })
    } catch {
      // Ignorer
    }
  },
}))
