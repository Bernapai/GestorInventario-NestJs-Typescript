import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import Transaction from './transactions.entity';
import { TransactionCreateDto } from './dto/transactionsCreate.dto';
import { TransactionUpdateDto } from './dto/transactionsUpdate.dto';

@Controller('transactions')
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
