import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { Auth } from '../common/decorators/auth.decorator';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UserDto } from '../user/dtos/user.dto';
import { GetUser } from '../user/decorators/user.decorator';
import { CourseService } from './course.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';

@Controller('course')
@ApiTags('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Auth()
  @Post()
  @ApiBody({ type: CreateCourseDto })
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @GetUser() user: User,
  ) {
    console.log('createCourseDto', createCourseDto);
    console.log('user', user);
    console.log('pass', user.password);
  }

  @Auth()
  @Get()
  async getAllCourses(@GetUser() user: UserDto) {
    return this.courseService.findAll(user);
  }
}
