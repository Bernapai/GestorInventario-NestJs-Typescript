import { Module } from '@nestjs/common';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Transaction from './entities/transactions.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AppCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AuthModule, AppCacheModule],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule { }
