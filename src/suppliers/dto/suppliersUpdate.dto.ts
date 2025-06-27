
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SupplierUpdateDto {
  @ApiPropertyOptional({
    example: 'Proveedor ABC',
    description: 'Nombre del proveedor (opcional)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Proveedor de materiales de construcción',
    description: 'Descripción del proveedor (opcional)',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '+54 9 11 1234-5678',
    description: 'Teléfono de contacto del proveedor (opcional)',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
