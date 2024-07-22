import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Course } from '../../course/entities/course.entity';
import { Homework } from '../../homework/entities/homework.entity';
import { Grade } from '../../grade/entities/grade.entity';

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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @OneToMany(() => Course, (course) => course.teacher)
  teachingCourses: Course[];

  @OneToMany(() => Homework, (homework) => homework.student)
  submittedHomeworks: Homework[];

  @OneToMany(() => Grade, (grade) => grade.teacher)
  grades: Grade[];

  @OneToMany(() => Grade, (grade) => grade.student)
  receivedGrades: Grade[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
