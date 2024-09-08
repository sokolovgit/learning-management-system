import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Homework } from '../../homework/entities/homework.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @ManyToOne(() => Homework, (homework) => homework.grades)
  homework: Homework;

  @ManyToOne(() => User, (user) => user.grades)
  teacher: User;

  @ManyToOne(() => User, (user) => user.receivedGrades)
  student: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
