import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'title',
    description: 'The title of the course',
    type: 'string',
    example: 'Course Title',
  })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'description',
    description: 'The description of the course',
    type: 'string',
    example: 'Course Description',
  })
  description: string;
}
