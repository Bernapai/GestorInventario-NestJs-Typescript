import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import Product from '../entities/products.entity';
import { ProductUpdateDto } from '../dto/productUpdate.dto';
import { ProductCreateDto } from '../dto/productCreate.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async getAll(): Promise<Product[]> {
    this.logger.log('Obteniendo todos los productos');
    const cacheKey = 'all_products';

    try {
      // Intentar obtener del cache
      const cached = await this.cacheManager.get<Product[]>(cacheKey);
      if (cached) {
        this.logger.log('Productos obtenidos del cache');
        return cached;
      }

      // Si no está en cache, obtener de DB
      const products = await this.productsRepository.find();
      await this.cacheManager.set(cacheKey, products, 300); // 5 minutos
      this.logger.log(`${products.length} productos obtenidos de DB y guardados en cache`);

      return products;
    } catch (error) {
      this.logger.error(`Error obteniendo productos: ${error.message}`);
      throw error;
    }
  }

  async getOne(id: number): Promise<Product | null> {
    const cacheKey = `product_${id}`;
    this.logger.log(`Obteniendo producto con id: ${id}`);
    try {
      // Intentar obtener del cache
      const cached = await this.cacheManager.get<Product>(cacheKey);
      if (cached) {
        this.logger.log(`Producto con id ${id} obtenido del cache`);
        return cached;
      }

      // Si no está en cache, obtener de DB
      const product = await this.productsRepository.findOne({ where: { id } });
      if (!product) {
        this.logger.warn(`Producto con id ${id} no encontrado`);
        return null;
      }

      await this.cacheManager.set(cacheKey, product, 300); // 5 minutos
      this.logger.log(`Producto con id ${id} obtenido de DB y guardado en cache`);
      return product;
    } catch (error) {
      this.logger.error(`Error obteniendo producto con id ${id}: ${error.message}`);
      throw error;
    }


  }

  async create(data: ProductCreateDto): Promise<Product> {
    this.logger.log(`Creando producto: ${data.name}`);
    try {
      const newProduct = this.productsRepository.create(data);
      const savedProduct = await this.productsRepository.save(newProduct);
      // Limpiar cache de productos
      await this.cacheManager.del('all_products');
      this.logger.log(`Producto creado con id: ${savedProduct.id}`);
      return savedProduct;
    } catch (error) {
      this.logger.error(`Error creando producto: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, data: ProductUpdateDto): Promise<Product> {
    this.logger.log(`Actualizando producto con id: ${id}`);
    try {
      await this.productsRepository.update({ id }, data);
      const product = await this.productsRepository.findOne({ where: { id } });
      if (!product) {
        throw new Error(`Producto con id ${id} no encontrado`);
      }
      // Limpiar cache de productos
      await this.cacheManager.del('all_products');
      this.logger.log(`Producto con id ${id} actualizado`);
      return product;
    } catch (error) {
      this.logger.error(`Error actualizando producto con id ${id}: ${error.message}`);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Eliminando producto con id: ${id}`);
    try {
      await this.productsRepository.delete({ id });
      // Limpiar cache de productos
      await this.cacheManager.del('all_products');
      this.logger.log(`Producto con id ${id} eliminado`);
    } catch (error) {
      this.logger.error(`Error eliminando producto con id ${id}: ${error.message}`);
      throw error;
    }
  }
}
