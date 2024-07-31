import type { UserRoleEnum } from '@/enums/userRoleEnum'

export interface User {
  id: number;
  username: string;
  email: string;
  isEmailVerified: boolean;
  role: UserRoleEnum;
  // teachingCourses?: Course[];
  // enrolledCourses?: Course[];
  createdAt: string;
  updatedAt: string;
}