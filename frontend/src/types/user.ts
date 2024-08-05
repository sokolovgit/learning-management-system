import type { UserRole } from '@/enums/userRole'

export interface User {
  id: number
  username: string
  email: string
  isEmailVerified: boolean
  role: UserRole
  // teachingCourses?: Course[];
  // enrolledCourses?: Course[];
  createdAt: string
  updatedAt: string
}
