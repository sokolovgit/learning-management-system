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

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

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
    logout
  }
})
