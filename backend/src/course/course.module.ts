import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { AbilitiesModule } from '../abilities/abilities.module';
import { CourseService } from './course.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), AbilitiesModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
