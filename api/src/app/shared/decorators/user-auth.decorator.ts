import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../../modules/user/entities/user.entity';

export const GetUserAuth = createParamDecorator(
  (_, ctx: ExecutionContext): UserEntity => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
