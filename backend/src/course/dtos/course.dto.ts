import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dtos/user.dto';
import { Course } from '../entities/course.entity';

export class CourseDto {
  @ApiProperty({
    description: 'The ID of the course',
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the course',
    type: 'string',
    example: 'Introduction to Programming',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the course',
    type: 'string',
    example: 'A beginner course on programming',
  })
  description: string;

  @ApiProperty({
    description: 'The teacher of the course',
    type: () => UserDto,
    example: UserDto,
  })
  teacher?: UserDto;

  @ApiProperty({
    description: 'The students enrolled in the course',
    type: () => [UserDto],
    example: [UserDto],
  })
  students?: UserDto[];

  constructor(course: Course) {
    this.id = course.id;
    this.title = course.title;
    this.description = course.description;
    this.teacher = course.teacher ? new UserDto(course.teacher) : undefined;
    this.students =
      course.students && course.students.length > 0
        ? course.students.map((student) => new UserDto(student))
        : undefined;
  }
}
