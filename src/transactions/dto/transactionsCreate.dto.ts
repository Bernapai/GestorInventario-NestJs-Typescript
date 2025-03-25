import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionCreateDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;
}
