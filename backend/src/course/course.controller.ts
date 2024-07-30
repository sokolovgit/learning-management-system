import { Auth } from '../common/decorators/auth.decorator';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';

import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../user/decorators/user.decorator';
import { CourseDto } from './dtos/course.dto';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { PaginationQueryOptionsDto } from '../common/dtos/pagination-query-options.dto';
import { Action } from '../abilities/enums/abilities.enum';
import { Course } from './entities/course.entity';
import { EnrollmentCode } from '../enrollment-code/entities/enrollment-code.entity';
import { CreateEnrollmentCodeDto } from '../enrollment-code/dtos/create-enrollment-code.dto';
import { EnrollmentCodeService } from '../enrollment-code/enrollment-code.service';
import { EnrollmentCodeDto } from '../enrollment-code/dtos/enrollment-code.dto';

@Controller('courses')
@ApiTags('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly enrollmentCodeService: EnrollmentCodeService,
  ) {}

  @Auth({ action: Action.Create, subject: Course })
  @Post()
  @ApiBody({ type: CreateCourseDto })
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: User,
  ) {
    const course =
      await this.courseService.createCourseWithUserAsTeacherOrThrow(
        createCourseDto,
        user,
      );
    return new CourseDto(course);
  }

  @ApiResponse({ status: 201, type: CourseDto })
  @Auth({ action: Action.Read, subject: Course })
  @Get()
  async getCurrentUserCourses(@CurrentUser() user: User) {
    const courses = await this.courseService.findUserCourses(user);
    return courses.map((course) => new CourseDto(course));
  }

  @Get('paginated')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  async getAllCoursesPaginated(
    @Query() paginationOptions: PaginationQueryOptionsDto,
  ) {
    const { courses, total, page, totalPages } =
      await this.courseService.findAllCoursesPaginated(
        paginationOptions.page,
        paginationOptions.pageSize,
      );

    const courseDtos = courses.map((course) => new CourseDto(course));
    return new PaginatedResponseDto<CourseDto>(
      courseDtos,
      total,
      page,
      totalPages,
    );
  }

  @Get(':id')
  async getCourseById(@Param('id') id: number) {
    const course = await this.courseService.findCourseByIdOrThrow(id);
    return new CourseDto(course);
  }

  @Post(':id/enroll')
  @Auth({ action: Action.Enroll, subject: Course })
  @ApiResponse({ status: 200, type: CourseDto })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Course ID',
  })
  async enrollCourse(@Param('id') id: number, @CurrentUser() user: User) {
    const course = await this.courseService.enrollUserInCourseOrThrow(id, user);
    return new CourseDto(course);
  }

  @Post(':id/generate-code')
  @Auth({ action: Action.Create, subject: EnrollmentCode })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Course ID',
  })
  @ApiBody({ type: CreateEnrollmentCodeDto })
  async generateEnrollmentCode(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body()
    createEnrollmentCodeDto: CreateEnrollmentCodeDto,
  ) {
    const enrollmentCode =
      await this.enrollmentCodeService.generateEnrollmentCode(
        id,
        createEnrollmentCodeDto,
        user,
      );

    return new EnrollmentCodeDto(enrollmentCode);
  }

  @Post('/enroll-with-code')
  @Auth({ action: Action.Enroll, subject: Course })
  @ApiQuery({
    name: 'code',
    required: true,
    type: String,
  })
  async enrollWithCode(
    @Query('code') requestEnrollmentCode: string,
    @CurrentUser() user: User,
  ) {
    const course =
      await this.enrollmentCodeService.enrollUserInCourseWithCodeOrThrow(
        requestEnrollmentCode,
        user,
      );

    return new CourseDto(course);
  }
}
