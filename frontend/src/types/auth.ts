import type { User } from '@/types/user'
import type { UserRoleEnum } from '@/enums/userRoleEnum'

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRoleEnum;
}

export interface RegisterResponse {
  user: User;
}

export interface VerifyEmailRequest {
  token: string;
}
