import { SetMetadata } from '@nestjs/common';
import { Subjects } from '../../abilities/ability.factory';
import { Action } from '../../abilities/enums/abilities.enum';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';
export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
