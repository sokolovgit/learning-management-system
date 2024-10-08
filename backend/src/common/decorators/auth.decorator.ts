import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CheckAbilities, RequiredRule } from './check-ability.decorator';
import { AbilitiesGuard } from '../guards/abilities.guard';

export function Auth(...abilities: RequiredRule[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, AbilitiesGuard),
    CheckAbilities(...abilities),
    ApiBearerAuth(),
  );
}
