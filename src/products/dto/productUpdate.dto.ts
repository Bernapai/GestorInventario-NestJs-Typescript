import { IsOptional, IsString, IsNumber } from 'class-validator';

export class ProductUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  categoryId?: number;

  @IsOptional()
  supplierId?: number;
}
