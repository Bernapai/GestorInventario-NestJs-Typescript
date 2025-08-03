import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../entities/users.entity';
import { UserCreateDto } from '../dto/userCreate.dto';
import { UserUpdateDto } from '../dto/userUpdate.dto';

@Injectable()
export class UsersService {

  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  // Obtener todos los usuarios
  async getAll(): Promise<User[]> {
    this.logger.log('Obteniendo todos los usuarios');
    const cacheKey = 'all_users';

    try {
      // Intentar obtener del cache
      const cached = await this.cacheManager.get<User[]>(cacheKey);
      if (cached) {
        this.logger.log('Usuarios obtenidos del cache');
        return cached;
      }

      // Si no está en cache, obtener de DB
      const users = await this.userRepository.find();
      await this.cacheManager.set(cacheKey, users, 300); // 5 minutos
      this.logger.log(`${users.length} usuarios obtenidos de DB y guardados en cache`);

      return users;
    } catch (error) {
      this.logger.error(`Error obteniendo usuarios: ${error.message}`);
      throw error;
    }
  }

  // Registrar un usuario usando solo el DTO
  async register(data: UserCreateDto): Promise<User> {
    this.logger.log(`Registrando usuario: ${data.name}`);
    try {
      const newUser = this.userRepository.create(data);
      const savedUser = await this.userRepository.save(newUser);
      // Limpiar cache de usuarios
      await this.cacheManager.del('all_users');
      this.logger.log(`Usuario registrado con id: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Error registrando usuario: ${error.message}`);
      throw error;
    }
  }

  // Obtener un solo usuario por ID
  async getOne(id: number): Promise<User | null> {
    const cacheKey = `user_${id}`;
    this.logger.log(`Buscando usuario por id: ${id}`);
    try {
      const cached = await this.cacheManager.get<User>(cacheKey);
      if (cached) {
        this.logger.log(`Usuario id ${id} obtenido del cache`);
        return cached;
      }
      const user = await this.userRepository.findOne({ where: { id } });
      if (user) {
        await this.cacheManager.set(cacheKey, user, 300);
        this.logger.log(`Usuario id ${id} obtenido de DB y guardado en cache`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error obteniendo usuario por id: ${error.message}`);
      throw error;
    }
  }

  // Obtener un usuario por nombre
  async findByName(name: string): Promise<User | null> {
    const cacheKey = `user_name_${name}`;
    this.logger.log(`Buscando usuario por nombre: ${name}`);
    try {
      const cached = await this.cacheManager.get<User>(cacheKey);
      if (cached) {
        this.logger.log(`Usuario ${name} obtenido del cache`);
        return cached;
      }
      const user = await this.userRepository.findOne({ where: { name } });
      if (user) {
        await this.cacheManager.set(cacheKey, user, 300);
        this.logger.log(`Usuario ${name} obtenido de DB y guardado en cache`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error obteniendo usuario por nombre: ${error.message}`);
      throw error;
    }
  }

  // Actualizar un usuario por ID
  async update(id: number, data: UserUpdateDto): Promise<User | null> {
    this.logger.log(`Actualizando usuario id: ${id}`);
    try {
      await this.userRepository.update(id, data);
      // Limpiar cache de este usuario y de la lista
      await this.cacheManager.del(`user_${id}`);
      await this.cacheManager.del('all_users');
      const updatedUser = await this.getOne(id);
      this.logger.log(`Usuario id ${id} actualizado`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error actualizando usuario: ${error.message}`);
      throw error;
    }
  }

  // Eliminar un usuario por ID
  async delete(id: number): Promise<boolean> {
    this.logger.log(`Eliminando usuario id: ${id}`);
    try {
      const result = await this.userRepository.delete(id);
      // Limpiar cache de este usuario y de la lista
      await this.cacheManager.del(`user_${id}`);
      await this.cacheManager.del('all_users');
      const deleted = (result.affected ?? 0) > 0;
      if (deleted) {
        this.logger.log(`Usuario id ${id} eliminado`);
      } else {
        this.logger.warn(`Usuario id ${id} no encontrado para eliminar`);
      }
      return deleted;
    } catch (error) {
      this.logger.error(`Error eliminando usuario: ${error.message}`);
      throw error;
    }
  }
}