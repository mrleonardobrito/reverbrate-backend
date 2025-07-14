import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserMapper } from 'src/users/mappers/user.mapper';

interface AuthenticatedRequest extends Request {
  user?: SpotifyApi.CurrentUsersProfileResponse;
}

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  if (!request.user) {
    return null;
  }
  return UserMapper.toDomain({
    id: request.user.id,
    email: request.user.email,
    name: request.user.display_name ?? request.user.email,
    image: request.user.images?.[0]?.url ?? '',
  });
});
