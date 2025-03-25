import { IsNotEmpty, IsString } from 'class-validator';

export class SupplierCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}
