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
import { CategorysService } from '../services/categorys.service';
import Categorys from '../entities/categorys.entity';
import { CategoryCreateDto } from '../dto/categorysCreate.dto';
import { CategoryUpdateDto } from '../dto/categorysUpdate.dto';
import { AuthGuard } from 'src/auth/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Categories')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('categorys')
export class CategorysController {
  constructor(private readonly categorysService: CategorysService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida correctamente',
    type: [Categorys],
  })
  async getCategorys(): Promise<Categorys[]> {
    return await this.categorysService.getCategorys();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoría obtenida correctamente',
    type: Categorys,
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async getOne(@Param('id') id: number): Promise<Categorys | null> {
    return await this.categorysService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada correctamente',
    type: Categorys,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() data: CategoryCreateDto): Promise<Categorys> {
    return await this.categorysService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una categoría por ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada correctamente',
    type: Categorys,
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async update(
    @Param('id') id: number,
    @Body() data: CategoryUpdateDto,
  ): Promise<Categorys> {
    return await this.categorysService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoría por ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoría eliminada correctamente',
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this.categorysService.delete(id);
  }
}
