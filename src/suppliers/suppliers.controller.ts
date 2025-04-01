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
import { SuppliersService } from './suppliers.service';
import Suppliers from './suppliers.entity';
import { SupplierCreateDto } from './dto/suppliersCreate.dto';
import { SupplierUpdateDto } from './dto/suppliersUpdate.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('suppliers')
@UseGuards(JwtAuthGuard) // Esto protegerá todas las rutas del controlador
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) { }

  @Get()
  async getCallSites(): Promise<Suppliers[]> {
    return await this.suppliersService.getCallSites();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Suppliers | null> {
    return await this.suppliersService.getOne(id);
  }

  @Post()
  async create(@Body() data: SupplierCreateDto): Promise<Suppliers> {
    return await this.suppliersService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: SupplierUpdateDto,
  ): Promise<Suppliers> {
    return await this.suppliersService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.suppliersService.delete(id);
  }
}
