import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class TransactionUpdateDto {
  @IsOptional()
  userId?: number;

  @IsOptional()
  productId?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsDate()
  date?: Date;
}
