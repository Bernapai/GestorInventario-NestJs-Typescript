import { IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
