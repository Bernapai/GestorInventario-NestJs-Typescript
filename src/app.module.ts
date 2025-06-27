import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategorysModule } from './categorys/categorys.module';
import { ProductsModule } from './products/products.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module'; // suponiendo que está acá

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigService disponible globalmente
      envFilePath: '.env', // opcional si usás otro archivo
    }),
    DatabaseModule, // acá se usa ConfigService pero sin importar ConfigModule
    AuthModule,
    CategorysModule,
    ProductsModule,
    SuppliersModule,
    TransactionsModule,
    UsersModule,
  ],
})
export class AppModule { }
