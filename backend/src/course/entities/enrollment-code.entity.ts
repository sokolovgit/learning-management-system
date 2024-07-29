import { Course } from './course.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class EnrollmentCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ type: 'timestamp' })
  expiration: Date;

  @Column({ default: false })
  isUsed: boolean;

  @OneToOne(() => Course, (course) => course.enrollmentCode)
  course: Course;

  @ManyToOne(() => User, (user) => user.teachingCourses)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
