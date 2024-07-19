import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AbilitiesGuard } from '../guards/abilities.guard';
import {
  CheckAbilities,
  RequiredRule,
} from '../decorators/check-ability.decorator';

export function Auth(...abilities: RequiredRule[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, AbilitiesGuard),
    CheckAbilities(...abilities),
    ApiBearerAuth(),
  );
}
