import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'
import {
  type LoginResponse,
  type LoginRequest,
  type RegisterRequest,
  type RegisterResponse,
  type VerifyEmailRequest
} from '@/types/auth'
import apiClient from '@/axios'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const router = useRouter()

  const setUser = (userData: User): void => {
    user.value = userData
  }

  const register = async (userData: RegisterRequest): Promise<void> => {
    console.log(userData)
    const response = await apiClient.post<RegisterResponse>('/auth/register', userData)
    user.value = response.data.user
  }

  const verifyEmail = async (tokenData: VerifyEmailRequest): Promise<void> => {
    await apiClient.post('/auth/verify-email', tokenData)
  }

  const login = async (credentials: LoginRequest): Promise<void> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
    localStorage.setItem('token', response.data.access_token)
    user.value = response.data.user
  }

  const fetchCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me')
    user.value = response.data
    return user.value
  }

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token')
  }

  const isTokenExpired = (): boolean => {
    const token = localStorage.getItem('token')
    if (!token) {
      return true
    }

    const decodedToken: { exp: number } = jwtDecode(token)

    return decodedToken.exp * 1000 < Date.now()
  }

  const loginWithGoogle = async () => {
    console.log('Login with Google:', `${import.meta.env.VITE_BACKEND_URL}/auth/google`)
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`
  }

  const handleGoogleAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (token) {
      // Save the token in localStorage
      localStorage.setItem('token', token)

      const decodedToken: User = jwtDecode(token)
      console.log('decodedToken:', decodedToken)
      setUser(decodedToken)

      await router.push('/dashboard')
    }
  }
  const logout = (): void => {
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    isAuthenticated,
    isTokenExpired,
    register,
    verifyEmail,
    login,
    loginWithGoogle,
    handleGoogleAuthCallback,
    logout
  }
})
