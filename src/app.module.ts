import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategorysModule } from './categorys/categorys.module';
import { ProductsModule } from './products/products.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { SuplliersController } from './suplliers/suplliers.controller';
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
  controllers: [AppController, SuplliersController],
  providers: [AppService],
})
export class AppModule { }
