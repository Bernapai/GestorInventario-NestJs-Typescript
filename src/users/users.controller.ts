import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import User from './users.entity';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { UserCreateDto } from './dto/userCreate.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  // Obtener todos los usuarios
  @Get()
  async getAll(): Promise<User[]> {
    return await this.usersService.getAll();
  }

  // Obtener un usuario por ID
  @Get(':id')
  async getOne(@Param('id') id: number): Promise<User | null> {
    return await this.usersService.getOne(id);
  }

  // Actualizar un usuario por ID
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UserUpdateDto, // Usamos el DTO UpdateUserDto aquí
  ): Promise<User | null> {
    return await this.usersService.update(id, data);
  }
  // Crear un usuario
  @Post()
  async register(@Body() data: UserCreateDto): Promise<User> {
    return await this.usersService.register(data);
  }

  // Eliminar un usuario por ID
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return await this.usersService.delete(id);
  }
}
