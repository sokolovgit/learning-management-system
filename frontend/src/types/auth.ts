import type { User } from '@/types/user'
import type { UserRole } from '@/enums/userRole'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  role: UserRole
}

export interface RegisterResponse {
  user: User
}

export interface VerifyEmailRequest {
  token: string
}
