import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductCreateDto {
  @ApiProperty({
    example: 'Martillo',
    description: 'Nombre del producto',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Martillo de acero inoxidable de 16oz',
    description: 'Descripción del producto',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 2500,
    description: 'Precio del producto en pesos',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Cantidad en stock disponible',
  })
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @ApiProperty({
    example: 3,
    description: 'ID de la categoría a la que pertenece el producto',
  })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    example: 5,
    description: 'ID del proveedor del producto',
  })
  @IsNotEmpty()
  supplierId: number;
}
