import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { HomeworkStatus } from '../enums/homework-status.enum';
import { Lesson } from '../../lesson/entities/lesson.entity';
import { User } from '../../user/entities/user.entity';
import { Grade } from '../../grade/entities/grade.entity';

@Entity()
export class Homework {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({
    type: 'enum',
    enum: HomeworkStatus,
    default: HomeworkStatus.PENDING,
  })
  status: HomeworkStatus;

  @ManyToOne(() => Lesson, (lesson) => lesson.homeworks)
  lesson: Lesson;

  @ManyToOne(() => User, (user) => user.submittedHomeworks)
  student: User;

  @OneToMany(() => Grade, (grade) => grade.homework)
  grades: Grade[]; // One homework can have multiple grades for grading history

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
