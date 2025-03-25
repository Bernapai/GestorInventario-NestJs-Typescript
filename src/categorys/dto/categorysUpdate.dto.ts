import { IsOptional, IsString } from 'class-validator';

export class CategoryUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
