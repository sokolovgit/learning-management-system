import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UserDto } from '../user/dtos/user.dto';

@Injectable()
export class CourseService {
  async createCourse(createCourseDto: CreateCourseDto, user: UserDto) {
    return;
  }

  async findAll(user: UserDto) {
    return;
  }
}
