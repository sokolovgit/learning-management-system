import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { EnrollmentCode } from './entities/enrollment-code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../course/entities/course.entity';
import { CreateEnrollmentCodeDto } from './dtos/create-enrollment-code.dto';
import { User } from '../user/entities/user.entity';
import { CourseService } from '../course/course.service';

import * as crypto from 'crypto';
import { EnrollmentCodeStatusEnum } from './enums/enrollment-code-status.enum';

@Injectable()
export class EnrollmentCodeService {
  constructor(
    @InjectRepository(EnrollmentCode)
    private enrollmentCodeRepository: Repository<EnrollmentCode>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private courseService: CourseService,
  ) {}

  async generateEnrollmentCode(
    courseId: number,
    createEnrollmentCodeDto: CreateEnrollmentCodeDto,
    user: User,
  ): Promise<EnrollmentCode> {
    const course = await this.courseRepository.findOne({
      where: {
        id: courseId,
      },
      relations: {
        teacher: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with id ${courseId} not found`);
    }

    if (course.teacher.id !== user.id) {
      throw new ForbiddenException(
        'Only the teacher can generate enrollment codes',
      );
    }

    const code = crypto.randomBytes(3).toString('hex');

    const enrollmentCode = this.enrollmentCodeRepository.create({
      code: code,
      course: course,
      createdBy: user,
      expiration: createEnrollmentCodeDto.expiration || null,
      maxUses: createEnrollmentCodeDto.maxUses || 1,
      uses: 0,
    });

    return await this.enrollmentCodeRepository.save(enrollmentCode);
  }

  async enrollUserInCourseWithCodeOrThrow(
    code: string,
    user: User,
  ): Promise<Course> {
    const enrollmentCode = await this.enrollmentCodeRepository.findOne({
      where: {
        code: code,
        status: EnrollmentCodeStatusEnum.ACTIVE,
      },
      relations: {
        course: true,
      },
    });

    if (!enrollmentCode) {
      throw new NotFoundException('Invalid enrollment code');
    }

    if (enrollmentCode.status !== EnrollmentCodeStatusEnum.ACTIVE) {
      throw new ForbiddenException('Enrollment code is not active');
    }

    if (enrollmentCode.uses >= enrollmentCode.maxUses) {
      enrollmentCode.status = EnrollmentCodeStatusEnum.USED;
      await this.enrollmentCodeRepository.save(enrollmentCode);
      throw new ForbiddenException(
        'Enrollment code has reached its maximum uses',
      );
    }

    const currentUtcDate = new Date();
    const expirationDateUtc = new Date(enrollmentCode.expiration);

    if (enrollmentCode.expiration && expirationDateUtc < currentUtcDate) {
      enrollmentCode.status = EnrollmentCodeStatusEnum.EXPIRED;
      await this.enrollmentCodeRepository.save(enrollmentCode);
      throw new ForbiddenException('Enrollment code has expired');
    }

    enrollmentCode.uses++;
    if (enrollmentCode.uses >= enrollmentCode.maxUses) {
      enrollmentCode.status = EnrollmentCodeStatusEnum.USED;
    }

    await this.enrollmentCodeRepository.save(enrollmentCode);

    return await this.courseService.enrollUserInCourseOrThrow(
      enrollmentCode.course.id,
      user,
    );
  }

  @Cron('0 0 * * *', { name: 'markInvalidCodes' }) // trigger every day at midnight
  async markInvalidCodes() {
    const now = new Date();

    const invalidCodes = await this.enrollmentCodeRepository
      .createQueryBuilder('enrollmentCode')
      .where('enrollmentCode.expiration <= :now', { now })
      .orWhere('enrollmentCode.uses >= enrollmentCode.maxUses')
      .getMany();

    invalidCodes.forEach((code) => {
      if (code.expiration && code.expiration <= now) {
        code.status = EnrollmentCodeStatusEnum.EXPIRED;
      } else if (code.uses >= code.maxUses) {
        code.status = EnrollmentCodeStatusEnum.USED;
      }
    });

    await this.enrollmentCodeRepository.save(invalidCodes);
  }
}
