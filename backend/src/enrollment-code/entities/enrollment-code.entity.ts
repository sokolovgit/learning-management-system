import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { User } from '../../user/entities/user.entity';
import { EnrollmentCodeStatusEnum } from '../enums/enrollment-code-status.enum';

@Entity()
export class EnrollmentCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ type: 'timestamp', nullable: true })
  expiration: Date;

  @Column({
    type: 'enum',
    enum: EnrollmentCodeStatusEnum,
    default: EnrollmentCodeStatusEnum.ACTIVE,
  })
  status: EnrollmentCodeStatusEnum;

  @Column({ default: 0 })
  uses: number;

  @Column({ nullable: true })
  maxUses: number;

  @ManyToOne(() => Course, (course) => course.enrollmentCodes)
  course: Course;

  @ManyToOne(() => User, (user) => user.createdEnrollmentCodes)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
