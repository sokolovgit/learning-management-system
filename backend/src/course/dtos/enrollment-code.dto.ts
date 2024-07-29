import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { CourseDto } from './course.dto';
import { UserDto } from '../../user/dtos/user.dto';

export class EnrollmentCodeDto {
  @ApiProperty({
    description: 'The ID of the enrollment code',
    type: 'number',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'The enrollment code',
    type: 'string',
    example: 'abc123',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'The expiration date of the enrollment code',
    type: 'string',
    example: '2021-07-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  expiration: Date;

  @ApiProperty({
    description: 'The status of the enrollment code',
    type: 'boolean',
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  isUsed: boolean;

  @ApiProperty({
    description: 'The course associated with the enrollment code',
    type: () => [CourseDto],
    example: [CourseDto],
  })
  @IsNotEmpty()
  course: CourseDto;

  @ApiProperty({
    description: 'The user who created the enrollment code',
    type: () => [UserDto],
    example: [UserDto],
  })
  @IsNotEmpty()
  createdBy: UserDto;

  @ApiProperty({
    description: 'The creation date of the enrollment code',
    type: () => Date,
    example: '2021-06-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The update date of the enrollment code',
    type: () => Date,
    example: '2021-06-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;
}
