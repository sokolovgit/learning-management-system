// frontend/src/axios.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      console.error('No token found in localStorage')
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient
