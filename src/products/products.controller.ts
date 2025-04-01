import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import Product from './products.entity';
import { ProductCreateDto } from './dto/productCreate.dto';
import { ProductUpdateDto } from './dto/productUpdate.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard) // Esto protegerá todas las rutas del controlador
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
  @Get()
  async getAll(): Promise<Product[]> {
    return await this.productsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Product | null> {
    return await this.productsService.getOne(id);
  }

  @Post()
  async create(@Body() data: ProductCreateDto): Promise<Product> {
    return await this.productsService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: ProductUpdateDto,
  ): Promise<Product> {
    return await this.productsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.productsService.delete(id);
  }
}
