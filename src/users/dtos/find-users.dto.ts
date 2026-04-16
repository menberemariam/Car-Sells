import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindUsersDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
