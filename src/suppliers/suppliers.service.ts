import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Suppliers from './suppliers.entity';
import { SupplierCreateDto } from './dto/suppliersCreate.dto';
import { SupplierUpdateDto } from './dto/suppliersUpdate.dto';
@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Suppliers)
    private readonly suppliersRepository: Repository<Suppliers>,
  ) { }

  async getCallSites(): Promise<Suppliers[]> {
    return await this.suppliersRepository.find();
  }

  async getOne(id: number): Promise<Suppliers | null> {
    return await this.suppliersRepository.findOne({ where: { id } });
  }

  async create(data: SupplierCreateDto): Promise<Suppliers> {
    const newSupplier = this.suppliersRepository.create(data);
    return await this.suppliersRepository.save(newSupplier);
  }

  async update(id: number, data: SupplierUpdateDto): Promise<Suppliers> {
    await this.suppliersRepository.update({ id }, data);
    const supplier = await this.suppliersRepository.findOne({
      where: { id },
    });
    if (!supplier) {
      throw new Error(`Supplier with id ${id} not found`);
    }
    return supplier;
  }

  async delete(id: number): Promise<void> {
    await this.suppliersRepository.delete({ id });
  }
}
