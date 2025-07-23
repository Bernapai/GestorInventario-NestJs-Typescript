// register.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'juan123', description: 'Nombre de usuario' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'juan@mail.com', description: 'Correo electrónico del usuario' })
  @IsNotEmpty()
  @IsString()
  email: string;
}
