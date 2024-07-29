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
import { EnrollmentCode } from './entities/enrollment-code.entity';
import { CreateEnrollmentCodeDto } from './dtos/create-enrollment-code.dto';

import * as jwt from 'jsonwebtoken';
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

  async findCourseByIdOrThrow(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: { teacher: true, students: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async enrollUserInCourseOrThrow(courseId: number, user: User) {
    const course = await this.findCourseByIdOrThrow(courseId);

    if (user.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Only students can enroll in courses');
    }

    if (course.students?.some((student) => student.id === user.id)) {
      throw new ForbiddenException('User is already enrolled in this course');
    }

    course.students = course.students || [];
    course.students.push(user);

    return this.courseRepository.save(course);
  }

  async generateEnrollmentCode(
    courseId: number,
    createEnrollmentCodeDto: CreateEnrollmentCodeDto,
    user: User,
  ) {
    const course = await this.findCourseByIdOrThrow(courseId);

    const payload = {
      sub: courseId,
      exp: createEnrollmentCodeDto.expiration
        ? createEnrollmentCodeDto.expiration.getTime() / 1000
        : undefined,
      oneTimeUse: createEnrollmentCodeDto.oneTimeUse,
    };

    const code = jwt.sign(payload, this.configService.get('JWT_SECRET'));

    const enrollmentCode = this.enrollmentCodeRepository.create({
      code,
      course,
      createdBy: user,
      expiration: createEnrollmentCodeDto.expiration || undefined,
      isUsed: createEnrollmentCodeDto.oneTimeUse,
    });

    return this.enrollmentCodeRepository.save(enrollmentCode);
  }

  async enrollUserInCourseWithCodeOrThrow(
    requestEnrollmentCode: string,
    user: User,
  ) {
    jwt.verify(requestEnrollmentCode, this.configService.get('JWT_SECRET'));

    const enrollmentCode = await this.enrollmentCodeRepository.findOne({
      where: { code: requestEnrollmentCode },
      relations: { course: true },
    });

    if (!enrollmentCode) {
      throw new NotFoundException('Invalid enrollment code');
    }

    if (enrollmentCode.isUsed || enrollmentCode.expiration < new Date()) {
      throw new ForbiddenException('Enrollment code is invalid or expired');
    }

    enrollmentCode.isUsed = true;
    await this.enrollmentCodeRepository.save(enrollmentCode);

    enrollmentCode.course.students = enrollmentCode.course.students || [];
    enrollmentCode.course.students.push(user);

    return this.courseRepository.save(enrollmentCode.course);
  }
}
