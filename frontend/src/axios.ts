import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const baseURL = import.meta.env.BACKEND_URL
console.log('baseURL:', baseURL)

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

export default apiClient
