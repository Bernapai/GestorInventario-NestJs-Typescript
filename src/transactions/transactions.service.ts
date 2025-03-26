import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionCreateDto } from './dto/transactionsCreate.dto';
import { TransactionUpdateDto } from './dto/transactionsUpdate.dto';
import Transaction from './transactions.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) { }

  async getAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find();
  }

  async getOne(id: number): Promise<Transaction | null> {
    return await this.transactionRepository.findOne({ where: { id } });
  }

  async create(data: TransactionCreateDto): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create(data);
    return await this.transactionRepository.save(newTransaction);
  }

  async update(id: number, data: TransactionUpdateDto): Promise<Transaction> {
    await this.transactionRepository.update({ id }, data);
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction) {
      throw new Error(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  async delete(id: number): Promise<void> {
    await this.transactionRepository.delete({ id });
  }
}
