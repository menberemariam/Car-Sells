import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from './../user.entity';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<any> {
    const request = context.switchToHttp().getRequest<{
      session?: { userId?: number };
      currentUser?: User;
    }>();
    const userId = request.session?.userId;
    if (userId) {
      const user = await this.usersService.findOne(userId);
      if (user) {
        request.currentUser = user;
      }
    }
    return handler.handle();
  }
}
