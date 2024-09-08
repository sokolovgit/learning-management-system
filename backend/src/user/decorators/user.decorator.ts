import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const http = ctx.switchToHttp();
    const request = http.getRequest();
    // case of no http connection
    if (!request) {
      return null;
    }
    return request.user;
  },
);
