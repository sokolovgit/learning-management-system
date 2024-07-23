import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dtos/user.dto';
import { Course } from '../entities/course.entity';

export class CourseDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The ID of the course',
    type: 'number',
    example: 1,
  })
  id: number;

  @IsNotEmpty()
  @ApiProperty({
    name: 'title',
    description: 'The title of the course',
    required: true,
    type: 'string',
    example: 'OOP Course',
  })
  title: string;

  @ApiProperty({
    name: 'description',
    description: 'The description of the course',
    type: 'string',
    example: 'This course is about OOP',
  })
  description: string;

  @ApiProperty({
    name: 'teacher',
    description: 'The teacher of the course',
    type: UserDto,
  })
  teacher: UserDto;

  @ApiProperty({
    name: 'students',
    description: 'The students of the course',
    type: [UserDto],
  })
  students: UserDto[];

  // @ApiProperty({
  //   name: 'lessons',
  //   description: 'The lessons of the course',
  //   type: [LessonDto],
  // })
  // lessons: LessonDto[];

  @ApiProperty({
    description: 'The creation date of the course',
    type: 'string',
    example: '2021-07-09T11:38:10.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The update date of the course',
    type: 'string',
    example: '2021-07-09T11:38:10.000Z',
  })
  updatedAt: Date;

  constructor(course: Course) {
    this.id = course.id;
    this.title = course.title;
    this.description = course.description;
    this.teacher = new UserDto(course.teacher);
    this.students = course.students
      ? course.students.map((student) => new UserDto(student))
      : [];

    this.createdAt = course.createdAt;
    this.updatedAt = course.updatedAt;
  }
}
