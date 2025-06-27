import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryUpdateDto {
  @ApiPropertyOptional({
    example: 'Herramientas',
    description: 'Nombre de la categoría (opcional)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Categoría para herramientas y utensilios',
    description: 'Descripción de la categoría (opcional)',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
