import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Categorys from './categorys.entity';
import { CategoryCreateDto } from './dto/categorysCreate.dto';
import { CategoryUpdateDto } from './dto/categorysUpdate.dto';
@Injectable()
export class CategorysService {
  constructor(
    @InjectRepository(Categorys)
    private readonly categorysRepository: Repository<Categorys>,
  ) { }

  async getCategorys(): Promise<Categorys[]> {
    return await this.categorysRepository.find();
  }

  async getOne(id: number): Promise<Categorys | null> {
    return await this.categorysRepository.findOne({ where: { id } });
  }

  async create(data: CategoryCreateDto): Promise<Categorys> {
    const newCategory = this.categorysRepository.create(data);
    return await this.categorysRepository.save(newCategory);
  }

  async update(id: number, data: CategoryUpdateDto): Promise<Categorys> {
    await this.categorysRepository.update({ id }, data);
    const category = await this.categorysRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return category;
  }

  async delete(id: number): Promise<void> {
    await this.categorysRepository.delete({ id });
  }

  async getCategorysBySupplierId(supplierId: number): Promise<Categorys[]> {
    return await this.categorysRepository.find({ where: { supplierId } });
  }
}
