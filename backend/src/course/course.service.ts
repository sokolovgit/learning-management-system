import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dtos/create-course.dto';
import { User } from '../user/entities/user.entity';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../user/enums/user-role.enum';
import { EnrollmentCode } from '../enrollment-code/entities/enrollment-code.entity';
import type { CourseRelation } from './types/course.relation';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(EnrollmentCode)
    private enrollmentCodeRepository: Repository<EnrollmentCode>,
    private configService: ConfigService,
  ) {}

  async createCourseWithUserAsTeacherOrThrow(
    createCourseDto: CreateCourseDto,
    user: User,
  ) {
    if (user.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Only teachers can create courses');
    }

    const course = this.courseRepository.create({
      title: createCourseDto.title,
      description: createCourseDto.description,
      teacher: user,
    });

    return this.courseRepository.save(course);
  }

  async findUserCourses(user: User) {
    if (user.role === UserRole.TEACHER) {
      return await this.findTeachingCoursesOrThrow(user);
    }

    if (user.role === UserRole.STUDENT) {
      return await this.findEnrolledCoursesOrThrow(user);
    }

    throw new ForbiddenException('Only teachers and students can view courses');
  }

  async findEnrolledCoursesOrThrow(user: User) {
    const courses = await this.courseRepository.find({
      relations: {
        students: true,
        teacher: true,
      },
      where: { students: { id: user.id } },
    });

    if (courses.length === 0) {
      throw new NotFoundException('No courses found');
    }

    return courses;
  }

  async findTeachingCoursesOrThrow(user: User) {
    const courses = await this.courseRepository.find({
      where: { teacher: { id: user.id } },
      relations: { teacher: true },
    });

    if (courses.length === 0) {
      throw new NotFoundException('No courses found');
    }

    return courses;
  }

  async findAllCoursesOrThrow() {
    const courses = await this.courseRepository.find({
      relations: { teacher: true, students: true },
    });

    if (courses.length === 0) {
      throw new NotFoundException('No courses found');
    }

    return courses;
  }

  async findAllCoursesPaginated(page: number, pageSize: number) {
    const [courses, total] = await this.courseRepository.findAndCount({
      relations: {
        teacher: true,
        students: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      courses,
      total,
      page,
      totalPages,
    };
  }

  async findCourseByIdOrThrow(id: number, relations: CourseRelation = {}) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations,
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async enrollUserInCourseOrThrow(courseId: number, user: User) {
    const course = await this.findCourseByIdOrThrow(courseId, {
      teacher: true,
      students: true,
    });

    if (user.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Only students can enroll in courses');
    }

    if (course.students?.some((student) => student.id === user.id)) {
      throw new ForbiddenException('User is already enrolled in this course');
    }

    course.students = course.students || [];
    course.students.push(user);

    return await this.courseRepository.save(course);
  }
}
