import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionCreateDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario que realiza la transacción',
  })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 10,
    description: 'ID del producto que se está comprando',
  })
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    example: 3,
    description: 'Cantidad de productos comprados',
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: 1500.75,
    description: 'Precio total de la transacción',
  })
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    example: '2024-07-01T14:30:00.000Z',
    description: 'Fecha de la transacción (en formato ISO)',
  })
  @IsNotEmpty()
  @IsDate()
  date: Date;
}
