import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Product from '../entities/products.entity';
import { ProductUpdateDto } from '../dto/productUpdate.dto';
import { ProductCreateDto } from '../dto/productCreate.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) { }

  async getAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async getOne(id: number): Promise<Product | null> {
    return await this.productsRepository.findOne({ where: { id } });
  }

  async create(data: ProductCreateDto): Promise<Product> {
    const newProduct = this.productsRepository.create(data);
    return await this.productsRepository.save(newProduct);
  }

  async update(id: number, data: ProductUpdateDto): Promise<Product> {
    await this.productsRepository.update({ id }, data);
    const product = await this.productsRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async delete(id: number): Promise<void> {
    await this.productsRepository.delete({ id });
  }
}
