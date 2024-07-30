import { ApiProperty } from '@nestjs/swagger';
import { CourseDto } from '../../course/dtos/course.dto';
import { UserDto } from '../../user/dtos/user.dto';
import { EnrollmentCode } from '../entities/enrollment-code.entity';
import { EnrollmentCodeStatusEnum } from '../enums/enrollment-code-status.enum';

export class EnrollmentCodeDto {
  @ApiProperty({
    description: 'The ID of the enrollment code',
    type: 'number',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'The enrollment code',
    type: 'string',
    example: 'abc123',
    required: true,
  })
  code: string;

  @ApiProperty({
    description: 'The expiration date of the enrollment code',
    type: 'string',
    example: '2021-07-01T00:00:00.000Z',
    required: false,
  })
  expiration: Date;

  @ApiProperty({
    description: 'The status of the enrollment code',
    type: () => EnrollmentCodeStatusEnum,
    example: EnrollmentCodeStatusEnum.ACTIVE,
    required: true,
  })
  status: EnrollmentCodeStatusEnum;

  @ApiProperty({
    description: 'The number of times the enrollment code has been used',
    type: 'number',
    example: 2,
    required: true,
  })
  uses: number;

  @ApiProperty({
    description: 'The maximum number of times the enrollment code can be used',
    type: 'number',
    example: 5,
    required: false,
  })
  maxUses: number;

  @ApiProperty({
    description: 'The course associated with the enrollment code',
    type: () => CourseDto,
    example: CourseDto,
    required: true,
  })
  course: CourseDto;

  @ApiProperty({
    description: 'The user who created the enrollment code',
    type: () => UserDto,
    example: UserDto,
    required: true,
  })
  createdBy: UserDto;

  @ApiProperty({
    description: 'The creation date of the enrollment code',
    type: () => Date,
    example: '2021-06-01T00:00:00.000Z',
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The update date of the enrollment code',
    type: () => Date,
    example: '2021-06-01T00:00:00.000Z',
    required: true,
  })
  updatedAt: Date;

  constructor(enrollmentCode: EnrollmentCode) {
    this.id = enrollmentCode.id;
    this.code = enrollmentCode.code;
    this.expiration = enrollmentCode.expiration;
    this.status = enrollmentCode.status;
    this.uses = enrollmentCode.uses;
    this.maxUses = enrollmentCode.maxUses;
    this.course = new CourseDto(enrollmentCode.course);
    this.createdBy = new UserDto(enrollmentCode.createdBy);
    this.createdAt = enrollmentCode.createdAt;
    this.updatedAt = enrollmentCode.updatedAt;
  }
}
