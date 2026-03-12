import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { API_URL } from '../lib/utils'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          })
          
          // Check if response is ok before parsing JSON
          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data.error || `Server error: ${res.status}`)
          }
          
          // Check if response has content
          const text = await res.text()
          if (!text || text.trim() === '') {
            throw new Error('Server tidak merespons. Pastikan server sedang berjalan.')
          }
          
          const data = JSON.parse(text)
          
          if (!data.token || !data.user) {
            throw new Error('Respons server tidak valid')
          }
          
          set({ user: data.user, token: data.token, isLoading: false })
          return true
        } catch (err) {
          let errorMessage = err.message
          
          // Handle specific error types
          if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
            errorMessage = 'Tidak dapat terhubung ke server. Pastikan server sedang berjalan di port 5000.'
          } else if (err.message.includes('Unexpected end of JSON')) {
            errorMessage = 'Server tidak merespons dengan benar. Pastikan server sedang berjalan.'
          }
          
          set({ error: errorMessage, isLoading: false })
          return false
        }
      },

      logout: () => {
        set({ user: null, token: null })
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
)

export const useLeadStore = create((set) => ({
  leads: [],
  currentLead: null,
  isLoading: false,
  error: null,
  
  fetchLeads: async (filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const token = useAuthStore.getState().token
      if (!token) {
        set({ leads: [], isLoading: false, error: 'Silakan login terlebih dahulu' })
        return
      }
      const params = new URLSearchParams(filters)
      const res = await fetch(`${API_URL}/leads?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        const errorData = await res.json()
        set({ leads: [], isLoading: false, error: errorData.error || 'Gagal memuat data lead' })
        return
      }
      const data = await res.json()
      set({ leads: data, isLoading: false, error: null })
    } catch (err) {
      set({ leads: [], isLoading: false, error: 'Tidak dapat terhubung ke server. Pastikan server berjalan.' })
    }
  },

  fetchLead: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        set({ currentLead: null, isLoading: false, error: 'Lead tidak ditemukan' })
        return
      }
      const data = await res.json()
      set({ currentLead: data, isLoading: false, error: null })
    } catch (err) {
      set({ currentLead: null, isLoading: false, error: 'Gagal memuat detail lead' })
    }
  },

  createLead: async (leadData) => {
    try {
      const token = useAuthStore.getState().token
      if (!token) {
        set({ error: 'Silakan login terlebih dahulu' })
        return false
      }
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(leadData)
      })
      
      // Get response text first
      const text = await res.text()
      
      // Check if response is valid JSON
      let data
      try {
        data = text ? JSON.parse(text) : {}
      } catch (e) {
        console.error('Invalid JSON response:', text)
        set({ error: 'Server response tidak valid' })
        return false
      }
      
      if (!res.ok) {
        set({ error: data.error || `Gagal membuat lead (${res.status})` })
        return false
      }
      
      set({ error: null })
      return true
    } catch (err) {
      console.error('Create lead error:', err)
      set({ error: 'Tidak dapat terhubung ke server' })
      return false
    }
  },

  updateLead: async (id, leadData) => {
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(leadData)
      })
      const data = await res.json()
      if (!res.ok) {
        set({ error: data.error || 'Gagal mengupdate lead' })
        return false
      }
      set({ error: null })
      return true
    } catch (err) {
      set({ error: 'Tidak dapat terhubung ke server' })
      return false
    }
  },

  deleteLead: async (id) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.ok
  },

  bulkDelete: async (ids) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/leads/bulk-delete`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ids })
    })
    return res.ok
  }
}))

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true })
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      set({ tasks: data, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
    }
  },

  createTask: async (taskData) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    })
    if (res.ok) {
      get().fetchTasks()
    }
    return res.ok
  },

  updateTask: async (id, taskData) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    })
    if (res.ok) {
      get().fetchTasks()
    }
    return res.ok
  },

  deleteTask: async (id) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      get().fetchTasks()
    }
    return res.ok
  }
}))

export const useSourceStore = create((set, get) => ({
  sources: [],
  isLoading: false,

  fetchSources: async () => {
    set({ isLoading: true })
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/sources`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      set({ sources: data, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
    }
  },

  createSource: async (sourceData) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/sources`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(sourceData)
    })
    if (res.ok) {
      get().fetchSources()
    }
    return res.ok
  },

  updateSource: async (id, sourceData) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/sources/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(sourceData)
    })
    if (res.ok) {
      get().fetchSources()
    }
    return res.ok
  },

  deleteSource: async (id) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/sources/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      get().fetchSources()
    }
    return res.ok
  }
}))

export const useDocumentStore = create((set, get) => ({
  documents: [],
  isLoading: false,

  fetchDocuments: async () => {
    set({ isLoading: true })
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      set({ documents: data, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
    }
  },

  uploadDocument: async (formData) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/documents`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    if (res.ok) {
      get().fetchDocuments()
    }
    return res.ok
  },

  deleteDocument: async (id) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      get().fetchDocuments()
    }
    return res.ok
  }
}))

export const useActivityStore = create((set) => ({
  activities: [],
  
  fetchActivities: async (limit = 10) => {
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/activities?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      set({ activities: data })
    } catch (err) {
      console.error(err)
    }
  }
}))

export const useFollowUpStore = create((set) => ({
  followUps: [],
  
  fetchFollowUps: async (type = 'upcoming') => {
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/follow-ups?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      set({ followUps: data })
    } catch (err) {
      console.error(err)
    }
  },

  createFollowUp: async (followUpData) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/follow-ups`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(followUpData)
    })
    return res.ok
  },

  updateFollowUp: async (id, data) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/follow-ups/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return res.ok
  }
}))

export const useReportStore = create((set) => ({
  stats: null,
  isLoading: false,

  fetchStats: async () => {
    set({ isLoading: true })
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/reports/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      set({ stats: data, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
    }
  }
}))

export const useUserStore = create((set, get) => ({
  users: [],
  staffStats: null,
  isLoading: false,

  fetchUsers: async () => {
    set({ isLoading: true })
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      set({ users: data, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
    }
  },

  fetchStaffStats: async () => {
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/users/staff-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      set({ staffStats: data })
    } catch (err) {
      console.error(err)
    }
  },

  createUser: async (userData) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    })
    const clone = res.clone()
    console.log('User create response:', res.status, res.statusText)
    const text = await clone.text()
    console.log('Response body:', text)
    
    if (res.ok) {
      get().fetchUsers()
      return true
    } else {
      console.error('User create FAILED:', res.status, text)
      return false
    }
  },


  updateUser: async (id, userData) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    })
    if (res.ok) {
      get().fetchUsers()
    }
    return res.ok
  },

  deleteUser: async (id) => {
    const token = useAuthStore.getState().token
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      get().fetchUsers()
    }
    return res.ok
  }
}))

