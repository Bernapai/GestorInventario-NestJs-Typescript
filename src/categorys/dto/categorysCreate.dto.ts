import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
