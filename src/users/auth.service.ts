import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // Check if email already exists
    const users = await this.usersService.find(email);
    if (users.length > 0) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hashBuffer = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hashBuffer.toString('hex')}`;

    const user = await this.usersService.create(email, result);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hashBuffer = (await scrypt(password, salt, 32)) as Buffer;
    const calculatedHash = hashBuffer.toString('hex');

    if (calculatedHash !== storedHash) {
      throw new BadRequestException('bad password');
    }

    return user;
  }
}
