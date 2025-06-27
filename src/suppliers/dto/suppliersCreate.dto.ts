import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SupplierCreateDto {
  @ApiProperty({
    example: 'Proveedor ABC',
    description: 'Nombre del proveedor',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Proveedor de materiales de construcción',
    description: 'Descripción del proveedor',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '+54 9 11 1234-5678',
    description: 'Teléfono de contacto del proveedor',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;
}
