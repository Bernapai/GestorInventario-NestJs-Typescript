import { Module } from '@nestjs/common';
import { CategorysController } from './controllers/categorys.controller';
import { CategorysService } from './services/categorys.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Category from './entities/categorys.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  controllers: [CategorysController],
  providers: [CategorysService]
})
export class CategorysModule { }
