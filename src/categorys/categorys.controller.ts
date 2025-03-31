import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CategorysService } from './categorys.service';
import Categorys from './categorys.entity';
import { CategoryCreateDto } from './dto/categorysCreate.dto';
import { CategoryUpdateDto } from './dto/categorysUpdate.dto';

@Controller('categorys')
export class CategorysController {
  constructor(private readonly categorysService: CategorysService) { }

  @Get()
  async getCategorys(): Promise<Categorys[]> {
    return await this.categorysService.getCategorys();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Categorys | null> {
    return await this.categorysService.getOne(id);
  }

  @Post()
  async create(@Body() data: CategoryCreateDto): Promise<Categorys> {
    return await this.categorysService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: CategoryUpdateDto,
  ): Promise<Categorys> {
    return await this.categorysService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.categorysService.delete(id);
  }
}
