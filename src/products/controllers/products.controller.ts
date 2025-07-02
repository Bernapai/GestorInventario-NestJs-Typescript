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
import { ProductsService } from '../services/products.service';
import Product from '../entities/products.entity';
import { ProductCreateDto } from '../dto/productCreate.dto';
import { ProductUpdateDto } from '../dto/productUpdate.dto';
import { AuthGuard } from 'src/auth/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Products')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida correctamente',
    type: [Product],
  })
  async getAll(): Promise<Product[]> {
    return await this.productsService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido correctamente',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getOne(@Param('id') id: number): Promise<Product | null> {
    return await this.productsService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado correctamente',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() data: ProductCreateDto): Promise<Product> {
    return await this.productsService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado correctamente',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async update(
    @Param('id') id: number,
    @Body() data: ProductUpdateDto,
  ): Promise<Product> {
    return await this.productsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this.productsService.delete(id);
  }
}
