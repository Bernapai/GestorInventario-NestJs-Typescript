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
import { TransactionsService } from './transactions.service';
import Transaction from './transactions.entity';
import { TransactionCreateDto } from './dto/transactionsCreate.dto';
import { TransactionUpdateDto } from './dto/transactionsUpdate.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard) // Esto protegerá todas las rutas del controlador
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Get()
  async getAll(): Promise<Transaction[]> {
    return await this.transactionsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Transaction | null> {
    return await this.transactionsService.getOne(id);
  }

  @Post()
  async create(@Body() data: TransactionCreateDto): Promise<Transaction> {
    return await this.transactionsService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: TransactionUpdateDto,
  ): Promise<Transaction> {
    return await this.transactionsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.transactionsService.delete(id);
  }
}
