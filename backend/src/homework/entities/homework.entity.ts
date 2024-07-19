import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Lesson } from '../../lesson/entities/lesson.entity';
import { User } from '../../user/entities/user.entity';
import { Grade } from '../../grade/entities/grade.entity';

@Entity()
export class Homework {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.homeworks)
  lesson: Lesson;

  @ManyToOne(() => User, (user) => user.homeworks)
  student: User;

  @OneToMany(() => Grade, (grade) => grade.homework)
  grades: Grade[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
