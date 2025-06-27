import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCreateDto {
  @ApiProperty({
    example: 'Herramientas',
    description: 'Nombre de la categoría',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Categoría para herramientas y utensilios',
    description: 'Descripción de la categoría',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
