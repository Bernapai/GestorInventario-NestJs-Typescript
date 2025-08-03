import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Categorys from '../entities/categorys.entity';
import { CategoryCreateDto } from '../dto/categorysCreate.dto';
import { CategoryUpdateDto } from '../dto/categorysUpdate.dto';

@Injectable()
export class CategorysService {
  private readonly logger = new Logger(CategorysService.name);

  constructor(
    @InjectRepository(Categorys)
    private readonly categorysRepository: Repository<Categorys>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async getCategorys(): Promise<Categorys[]> {
    this.logger.log('Obteniendo todas las categorías');
    const cacheKey = 'all_categories';

    try {
      // Intentar obtener del cache
      const cached = await this.cacheManager.get<Categorys[]>(cacheKey);
      if (cached) {
        this.logger.log('Categorías obtenidas del cache');
        return cached;
      }

      const categories = await this.categorysRepository.find();

      // Guardar en cache
      await this.cacheManager.set(cacheKey, categories, 300);
      this.logger.log(`${categories.length} categorías obtenidas de DB y guardadas en cache`);
      return categories;
    } catch (error) {
      this.logger.error(`Error obteniendo categorías: ${error.message}`);
      throw error;
    }
  }

  async getOne(id: number): Promise<Categorys | null> {
    this.logger.log(`Buscando categoría con ID: ${id}`);
    const cacheKey = `category_${id}`;

    try {
      const cached = await this.cacheManager.get<Categorys>(cacheKey);
      if (cached) {
        this.logger.log(`Categoría ${id} obtenida del cache`);
        return cached;
      }

      const category = await this.categorysRepository.findOne({ where: { id } });
      if (category) {
        await this.cacheManager.set(cacheKey, category, 300);
        this.logger.log(`Categoría ${id} obtenida de DB y guardada en cache`);
      } else {
        this.logger.warn(`Categoría con ID ${id} no encontrada`);
      }
      return category;
    } catch (error) {
      this.logger.error(`Error buscando categoría ${id}: ${error.message}`);
      throw error;
    }
  }

  async create(data: CategoryCreateDto): Promise<Categorys> {
    this.logger.log(`Creando nueva categoría: ${data.name}`);
    try {
      const newCategory = this.categorysRepository.create(data);
      const savedCategory = await this.categorysRepository.save(newCategory);

      // Limpiar cache
      await this.cacheManager.del('all_categories');
      this.logger.log(`Categoría creada exitosamente con ID: ${savedCategory.id}, cache limpiado`);
      return savedCategory;
    } catch (error) {
      this.logger.error(`Error creando categoría ${data.name}: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, data: CategoryUpdateDto): Promise<Categorys> {
    this.logger.log(`Actualizando categoría con ID: ${id}`);
    try {
      await this.categorysRepository.update({ id }, data);
      const updatedCategory = await this.categorysRepository.findOne({ where: { id } });
      if (!updatedCategory) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
      }

      // Limpiar cache
      await this.cacheManager.del('all_categories');
      this.logger.log(`Categoría con ID ${id} actualizada exitosamente, cache limpiado`);
      return updatedCategory;
    } catch (error) {
      this.logger.error(`Error actualizando categoría con ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Eliminando categoría con ID: ${id}`);
    try {
      const result = await this.categorysRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
      }

      // Limpiar cache
      await this.cacheManager.del('all_categories');
      this.logger.log(`Categoría con ID ${id} eliminada exitosamente, cache limpiado`);
    } catch (error) {
      this.logger.error(`Error eliminando categoría con ID ${id}: ${error.message}`);
      throw error;
    }
  }
}