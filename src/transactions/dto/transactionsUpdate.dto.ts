import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TransactionUpdateDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Nuevo ID del usuario (opcional)',
  })
  @IsOptional()
  userId?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Nuevo ID del producto (opcional)',
  })
  @IsOptional()
  productId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Nueva cantidad de productos (opcional)',
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({
    example: 999.99,
    description: 'Nuevo precio total de la transacción (opcional)',
  })
  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @ApiPropertyOptional({
    example: '2024-07-01T14:30:00.000Z',
    description: 'Nueva fecha de la transacción (opcional, formato ISO)',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;
}
