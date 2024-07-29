import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilitiesModule } from '../abilities/abilities.module';

import { Course } from './entities/course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { EnrollmentCode } from './entities/enrollment-code.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, EnrollmentCode]),
    ConfigModule,
    AbilitiesModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
