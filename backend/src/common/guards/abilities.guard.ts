import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../../abilities/ability.factory';
import {
  CHECK_ABILITY,
  RequiredRule,
} from '../decorators/check-ability.decorator';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    const ability = this.abilityFactory.defineAbility(user);

    for (const rule of rules) {
      if (!ability.can(rule.action, rule.subject)) {
        return false;
      }
    }
    return true;
  }
}
