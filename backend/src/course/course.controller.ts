import { Auth } from '../common/decorators/auth.decorator';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';

import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../user/decorators/user.decorator';
import { CourseDto } from './dtos/course.dto';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { PaginationQueryOptionsDto } from '../common/dtos/pagination-query-options.dto';

@Controller('course')
@ApiTags('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Auth()
  @Post()
  @ApiBody({ type: CreateCourseDto })
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: User,
  ) {
    const course = await this.courseService.createCourseWithUserAsTeacher(
      createCourseDto,
      user,
    );
    return new CourseDto(course);
  }

  @Get()
  async getAllCourses() {
    const courses = await this.courseService.findAllCoursesOrThrow();
    return courses.map((course) => new CourseDto(course));
  }

  @Get(':id')
  async getCourseById(id: number) {
    const course = await this.courseService.findCourseByIdOrThrow(id);
    return new CourseDto(course);
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
}
