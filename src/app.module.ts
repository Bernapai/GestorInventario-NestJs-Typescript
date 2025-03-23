import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategorysModule } from './categorys/categorys.module';
import { ProductsModule } from './products/products.module';
import { SuppliersModule } from './suppliers/suppliers.module';

import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    CategorysModule,
    ProductsModule,
    SuppliersModule,
    TransactionsModule,
    UsersModule,
  ],
})
export class AppModule { }
