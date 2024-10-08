import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Lesson } from '../../lesson/entities/lesson.entity';
import { EnrollmentCode } from '../../enrollment-code/entities/enrollment-code.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.teachingCourses)
  teacher: User;

  @ManyToMany(() => User, (user) => user.enrolledCourses)
  @JoinTable()
  students: User[];

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => EnrollmentCode, (code) => code.course)
  enrollmentCodes: EnrollmentCode[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
