import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/users.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User])], // Aquí deberías importar tus entidades de usuario
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] // Exportamos el servicio para que pueda ser utilizado en otros módulos
})
export class UsersModule { }
