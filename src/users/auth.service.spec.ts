import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common'; // ← added this
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create Fake copy of UsersService with only the methods we need
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };  

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService, // correct: use the class token
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('userA@email.com', 'userAPassword');
    expect(user.password).not.toEqual('userAPassword');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('userA@email.com', 'userAPassword');
    await expect(
      service.signup('userA@email.com', 'userAPassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws error when signing in with non-existing email', async () => {
    await expect(service.signin('never@exists.com', '123456')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws error if an invalid password is provided', async () => {
    await service.signup('asdf@asdf', 'asdfPassword');
    await expect(service.signin('asdf@asdf', 'Password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('userA@email.com', 'anyPassword');
    const user = await service.signin('userA@email.com', 'anyPassword');
    expect(user).toBeDefined();
  });
});
