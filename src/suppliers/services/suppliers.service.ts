import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import Suppliers from '../entities/suppliers.entity';
import { SupplierCreateDto } from '../dto/suppliersCreate.dto';
import { SupplierUpdateDto } from '../dto/suppliersUpdate.dto';

@Injectable()
export class SuppliersService {
  private readonly logger = new Logger(SuppliersService.name);

  constructor(
    @InjectRepository(Suppliers)
    private readonly suppliersRepository: Repository<Suppliers>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async getCallSites(): Promise<Suppliers[]> {
    this.logger.log('Obteniendo todos los proveedores');
    const cacheKey = 'all_suppliers';
    try {
      // Intentar obtener del cache
      const cached = await this.cacheManager.get<Suppliers[]>(cacheKey);
      if (cached) {
        this.logger.log('Proveedores obtenidos del cache');
        return cached;
      }

      const suppliers = await this.suppliersRepository.find();

      // Guardar en cache
      await this.cacheManager.set(cacheKey, suppliers, 300);
      this.logger.log(`${suppliers.length} proveedores obtenidos de DB y guardados en cache`);
      return suppliers;
    } catch (error) {
      this.logger.error(`Error obteniendo proveedores: ${error.message}`);
      throw error;
    }
  }

  async getOne(id: number): Promise<Suppliers | null> {
    this.logger.log(`Buscando proveedor con ID: ${id}`);
    const cacheKey = `supplier_${id}`;
    try {
      const cached = await this.cacheManager.get<Suppliers>(cacheKey);
      if (cached) {
        this.logger.log(`Proveedor ${id} obtenido del cache`);
        return cached;
      }

      const supplier = await this.suppliersRepository.findOne({ where: { id } });
      if (supplier) {
        await this.cacheManager.set(cacheKey, supplier, 300);
        this.logger.log(`Proveedor ${id} obtenido de DB y guardado en cache`);
      } else {
        this.logger.warn(`Proveedor con ID ${id} no encontrado`);
      }
      return supplier;
    } catch (error) {
      this.logger.error(`Error obteniendo proveedor: ${error.message}`);
      throw error;
    }
  }

  async create(data: SupplierCreateDto): Promise<Suppliers> {
    this.logger.log(`Creando nuevo proveedor: ${data.name}`);
    try {
      const supplier = this.suppliersRepository.create(data);
      const savedSupplier = await this.suppliersRepository.save(supplier);
      this.logger.log(`Proveedor ${savedSupplier.id} creado exitosamente`);
      return savedSupplier;
    } catch (error) {
      this.logger.error(`Error creando proveedor: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, data: SupplierUpdateDto): Promise<Suppliers> {
    this.logger.log(`Actualizando proveedor con ID: ${id}`);
    try {
      const supplier = await this.suppliersRepository.findOne({ where: { id } });
      if (!supplier) {
        this.logger.warn(`Proveedor con ID ${id} no encontrado para actualizar`);
        throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
      }

      Object.assign(supplier, data);
      const updatedSupplier = await this.suppliersRepository.save(supplier);

      // Limpiar cache
      await this.cacheManager.del('all_suppliers');
      this.logger.log(`Proveedor ${id} actualizado exitosamente, cache limpiado`);
      return updatedSupplier;
    } catch (error) {
      this.logger.error(`Error actualizando proveedor ${id}: ${error.message}`);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Eliminando proveedor con ID: ${id}`);
    try {
      const result = await this.suppliersRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Proveedor con ID ${id} no encontrado para eliminar`);
        throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
      }

      // Limpiar cache
      await this.cacheManager.del('all_suppliers');
      this.logger.log(`Proveedor con ID ${id} eliminado exitosamente, cache limpiado`);
    } catch (error) {
      this.logger.error(`Error eliminando proveedor ${id}: ${error.message}`);
      throw error;
    }
  }
}