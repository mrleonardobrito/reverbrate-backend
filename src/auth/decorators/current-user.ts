import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserMapper } from 'src/users/mappers/user.mapper';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return UserMapper.toDomain({
      id: request.user.id,
      email: request.user.email,
      name: request.user.display_name,
      image: request.user.images[0].url,
    });
  },
);
