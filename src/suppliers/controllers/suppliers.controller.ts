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
import { SuppliersService } from '../services/suppliers.service';
import Suppliers from '../entities/suppliers.entity';
import { SupplierCreateDto } from '../dto/suppliersCreate.dto';
import { SupplierUpdateDto } from '../dto/suppliersUpdate.dto';
import { AuthGuard } from 'src/auth/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Suppliers')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de proveedores obtenida correctamente',
    type: [Suppliers],
  })
  async getCallSites(): Promise<Suppliers[]> {
    return await this.suppliersService.getCallSites();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proveedor por ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor obtenido correctamente',
    type: Suppliers,
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  async getOne(@Param('id') id: number): Promise<Suppliers | null> {
    return await this.suppliersService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({
    status: 201,
    description: 'Proveedor creado correctamente',
    type: Suppliers,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() data: SupplierCreateDto): Promise<Suppliers> {
    return await this.suppliersService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un proveedor por ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor actualizado correctamente',
    type: Suppliers,
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  async update(
    @Param('id') id: number,
    @Body() data: SupplierUpdateDto,
  ): Promise<Suppliers> {
    return await this.suppliersService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un proveedor por ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor eliminado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this.suppliersService.delete(id);
  }
}
