import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User | undefined => { 
    const request = context.switchToHttp().getRequest<{ currentUser?: User }>();
    return request.currentUser;
  },
);
