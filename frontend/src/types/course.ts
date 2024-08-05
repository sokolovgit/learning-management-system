import type { User } from '@/types/user'

export interface Course {
  id: number
  title: string
  description: string
  teacher?: User
  students?: User[]
}
