import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request.user', request.user as User);
    if (data) {
      return data in request.user ? request.user[data] : null;
    }
    return request.user;
  },
);
