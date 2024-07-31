import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types/user'
import { type LoginResponse, type LoginRequest, type RegisterRequest, type RegisterResponse, type VerifyEmailRequest } from '@/types/auth'
import apiClient from '@/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  const register = async (userData: RegisterRequest): Promise<void> => {

    console.log(userData);
    const response = await apiClient.post<RegisterResponse>('/auth/register', userData);
    user.value = response.data.user;
  };

  const verifyEmail = async (tokenData: VerifyEmailRequest): Promise<void> => {
    await apiClient.post('/auth/verify-email', tokenData);
  }

  const login = async (credentials: LoginRequest): Promise<void> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    token.value = response.data.token;
    user.value = response.data.user;
    localStorage.setItem('token', token.value);
  }

  const logout = (): void => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    register,
    verifyEmail,
    login,
    logout };
});
