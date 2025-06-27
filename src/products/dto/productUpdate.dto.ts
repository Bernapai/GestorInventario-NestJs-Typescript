import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductUpdateDto {
  @ApiPropertyOptional({
    example: 'Martillo',
    description: 'Nombre del producto (opcional)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Martillo de acero inoxidable de 16oz',
    description: 'Descripción del producto (opcional)',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 2500,
    description: 'Precio del producto en pesos (opcional)',
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Cantidad en stock disponible (opcional)',
  })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'ID de la categoría a la que pertenece el producto (opcional)',
  })
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'ID del proveedor del producto (opcional)',
  })
  @IsOptional()
  supplierId?: number;
}
