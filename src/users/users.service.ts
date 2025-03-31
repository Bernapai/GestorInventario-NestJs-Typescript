import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // Obtener todos los usuarios
  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async register(data: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  // Obtener un solo usuario por ID
  async getOne(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // Obtener un solo usuario por nombre
  async findByName(name: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { name } });
  }

  // Actualizar un usuario por ID
  async update(id: number, data: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, data);
    return this.getOne(id);
  }

  // Eliminar un usuario por ID
  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findBByname(name: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { name } });
  }
}
