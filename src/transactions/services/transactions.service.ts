import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionCreateDto } from '../dto/transactionsCreate.dto';
import { TransactionUpdateDto } from '../dto/transactionsUpdate.dto';
import Transaction from '../entities/transactions.entity';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async getAll(): Promise<Transaction[]> {
    this.logger.log('Obteniendo todas las transacciones');
    const cacheKey = 'all_transactions';

    try {
      // Intentar obtener del cache
      const cached = await this.cacheManager.get<Transaction[]>(cacheKey);
      if (cached) {
        this.logger.log('Transacciones obtenidas del cache');
        return cached;
      }

      // Si no está en cache, obtener de DB
      const transactions = await this.transactionRepository.find();
      await this.cacheManager.set(cacheKey, transactions, 300); // 5 minutos
      this.logger.log(`${transactions.length} transacciones obtenidas de DB y guardadas en cache`);

      return transactions;
    } catch (error) {
      this.logger.error(`Error obteniendo transacciones: ${error.message}`);
      throw error;
    }
  }

  async getOne(id: number): Promise<Transaction | null> {
    const cacheKey = `transaction_${id}`;
    this.logger.log(`Obteniendo transacción con id: ${id}`);
    try {
      // Intentar obtener del cache
      const cached = await this.cacheManager.get<Transaction>(cacheKey);
      if (cached) {
        this.logger.log(`Transacción con id ${id} obtenida del cache`);
        return cached;
      }

      // Si no está en cache, obtener de DB
      const transaction = await this.transactionRepository.findOne({ where: { id } });
      if (!transaction) {
        this.logger.warn(`Transacción con id ${id} no encontrada`);
        return null;
      }

      // Guardar en cache
      await this.cacheManager.set(cacheKey, transaction, 300); // 5 minutos
      return transaction;
    } catch (error) {
      this.logger.error(`Error obteniendo transacción: ${error.message}`);
      throw error;
    }
  }

  async create(data: TransactionCreateDto): Promise<Transaction> {
    this.logger.log(`Registrando transacción de : ${data.productId}`);
    try {
      const newTransaction = this.transactionRepository.create(data);
      const savedTransaction = await this.transactionRepository.save(newTransaction);
      // Limpiar cache de transacciones
      await this.cacheManager.del('all_transactions');
      this.logger.log(`Transacción registrada con id: ${savedTransaction.id}`);
      return savedTransaction;
    } catch (error) {
      this.logger.error(`Error registrando transacción: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, data: TransactionUpdateDto): Promise<Transaction> {
    this.logger.log(`Actualizando transacción con id: ${id}`);
    try {
      await this.transactionRepository.update({ id }, data);
      const transaction = await this.transactionRepository.findOne({ where: { id } });
      if (!transaction) {
        throw new Error(`Transaction with id ${id} not found`);
      }
      // Limpiar cache de transacciones
      await this.cacheManager.del('all_transactions');
      this.logger.log(`Transacción con id ${id} actualizada`);
      return transaction;
    } catch (error) {
      this.logger.error(`Error actualizando transacción: ${error.message}`);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Eliminando transacción con id: ${id}`);
    try {
      await this.transactionRepository.delete({ id });
      // Limpiar cache de transacciones
      await this.cacheManager.del('all_transactions');
      this.logger.log(`Transacción con id ${id} eliminada`);
    } catch (error) {
      this.logger.error(`Error eliminando transacción: ${error.message}`);
      throw error;
    }
  }
}
