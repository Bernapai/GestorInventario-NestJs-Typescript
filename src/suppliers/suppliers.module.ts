import { Module } from '@nestjs/common';
import { SuppliersController } from './controllers/suppliers.controller';
import { SuppliersService } from './services/suppliers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Supplier from './entities/suppliers.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  controllers: [SuppliersController],
  providers: [SuppliersService]
})
export class SuppliersModule { }
