import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Course } from '../../course/entities/course.entity';
import { Homework } from '../../homework/entities/homework.entity';
import { Grade } from '../../grade/entities/grade.entity';
import { EnrollmentCode } from '../../enrollment-code/entities/enrollment-code.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToMany(() => Course, (course) => course.teacher)
  teachingCourses: Course[];

  @ManyToMany(() => Course, (course) => course.students)
  enrolledCourses: Course[];

  @OneToMany(() => Homework, (homework) => homework.student)
  submittedHomeworks: Homework[];

  @OneToMany(() => Grade, (grade) => grade.teacher)
  grades: Grade[];

  @OneToMany(() => Grade, (grade) => grade.student)
  receivedGrades: Grade[];

  @OneToMany(() => EnrollmentCode, (code) => code.createdBy)
  createdEnrollmentCodes: EnrollmentCode[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
