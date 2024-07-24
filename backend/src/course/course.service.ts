import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dtos/create-course.dto';
import { User } from '../user/entities/user.entity';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}
  async createCourseWithUserAsTeacher(
    createCourseDto: CreateCourseDto,
    user: User,
  ) {
    const course = this.courseRepository.create({
      title: createCourseDto.title,
      description: createCourseDto.description,
      teacher: user,
    });

    return this.courseRepository.save(course);
  }

  async findAllCoursesOrThrow() {
    const courses = await this.courseRepository.find({
      relations: ['teacher'],
    });

    if (!courses) {
      throw new NotFoundException('No courses found');
    }

    return courses;
  }

  async findAllCoursesPaginated(page: number, pageSize: number) {
    const courses = await this.courseRepository.find({
      relations: ['teacher'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await this.courseRepository.count();
    const totalPages = Math.ceil(total / pageSize);

    return {
      courses,
      total,
      page,
      totalPages,
    };
  }

  async findCourseByIdOrThrow(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }
}
