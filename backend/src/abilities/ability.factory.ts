import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Course } from '../course/entities/course.entity';
import { Lesson } from '../lesson/entities/lesson.entity';
import { Homework } from '../homework/entities/homework.entity';
import { Grade } from '../grade/entities/grade.entity';
import { UserRole } from '../user/enums/user-role.enum';
import { Action } from './enums/abilities.enum';

export type Subjects =
  | InferSubjects<
      | typeof User
      | typeof Course
      | typeof Lesson
      | typeof Homework
      | typeof Grade
    >
  | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (user.role === UserRole.TEACHER) {
      can(Action.Create, Course);
      can(Action.Update, Course);
      can(Action.Delete, Course);
      can(Action.Read, Course);

      can(Action.Read, Lesson);

      can(Action.Read, Homework);
      can(Action.Update, Homework);

      can(Action.Create, Grade);
      can(Action.Update, Grade);
      can(Action.Read, Grade);
    } else {
      can(Action.Read, Course);
      can(Action.Enroll, Course);

      can(Action.Read, Lesson);

      can(Action.Create, Homework);
      can(Action.Update, Homework);
      can(Action.Read, Homework);

      can(Action.Read, Grade);

      cannot(Action.Create, Course);
      cannot(Action.Update, Course);
      cannot(Action.Delete, Course);

      cannot(Action.Create, Grade);
      cannot(Action.Update, Grade);
    }

    const ability = build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });

    return ability;
  }
}
