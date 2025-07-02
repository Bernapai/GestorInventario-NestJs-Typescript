import { Module } from '@nestjs/common';
import { ProductsController } from '../../src/products/controllers/products.controller';
import { ProductsService } from './services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from '../../src/products/entities/products.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
