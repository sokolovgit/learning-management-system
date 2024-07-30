import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { CourseDto } from '../../course/dtos/course.dto';
import { UserRole } from '../enums/user-role.enum';

export class UserDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The ID of the user',
    type: 'number',
    example: 1,
  })
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'username',
    description: 'The name of the user',
    type: 'string',
    example: 'John Doe',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    name: 'email',
    description: 'The email of the user',
    type: 'string',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The email verification status of the user',
    type: 'boolean',
    example: false,
  })
  @IsNotEmpty()
  isEmailVerified: boolean;

  password: string;

  @IsNotEmpty()
  @ApiProperty({
    name: 'role',
    description: 'The role of the user',
    type: 'UserRole',
    example: UserRole.STUDENT,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Courses that the user is teaching',
    type: () => [CourseDto],
    example: [CourseDto],
  })
  @IsOptional()
  teachingCourses: CourseDto[] | undefined;

  @ApiProperty({
    description: 'Courses that the user is enrolled in',
    type: () => [CourseDto],
    example: [CourseDto],
  })
  @IsOptional()
  enrolledCourses: CourseDto[] | undefined;

  @ApiProperty({
    description: 'The creation date of the user',
    type: 'string',
    example: '2021-07-09T11:38:10.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The update date of the user',
    type: 'string',
    example: '2021-07-09T11:38:10.000Z',
  })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.isEmailVerified = user.isEmailVerified;
    this.role = user.role;
    this.teachingCourses =
      user.teachingCourses && user.teachingCourses.length > 0
        ? user.teachingCourses.map((course) => new CourseDto(course))
        : undefined;
    this.enrolledCourses =
      user.enrolledCourses && user.enrolledCourses.length > 0
        ? user.enrolledCourses.map((course) => new CourseDto(course))
        : undefined;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
