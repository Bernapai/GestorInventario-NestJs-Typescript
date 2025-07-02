import { Module } from '@nestjs/common';
import { CategorysController } from './controllers/categorys.controller';
import { CategorysService } from './services/categorys.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Category from './entities/categorys.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategorysController],
  providers: [CategorysService]
})
export class CategorysModule { }
