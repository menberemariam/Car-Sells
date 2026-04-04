import { Injectable, NestMiddleware } from '@nestjs/common';
import 'express-session';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

// prefer ES modules for augmentation (eslint:no-namespace)
declare module 'express' {
  interface Request {
    currentUser?: User;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(
    req: Request & { session?: { userId?: number } },
    res: Response,
    next: NextFunction,
  ) {
    const { userId } = req.session ?? ({} as { userId?: number });

    if (userId) {
      const user = await this.usersService.findOne(userId);
      if (user) {
        req.currentUser = user;
      }
    }
    next();
  }
}
