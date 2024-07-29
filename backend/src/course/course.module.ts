import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilitiesModule } from '../abilities/abilities.module';

import { Course } from './entities/course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), AbilitiesModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
