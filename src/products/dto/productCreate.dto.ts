import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ProductCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  categoryId: number;

  @IsNotEmpty()
  supplierId: number;
}
