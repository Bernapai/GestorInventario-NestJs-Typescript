import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AppCacheModule } from 'src/cache/cache.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), AppCacheModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] // Exportamos el servicio para que pueda ser utilizado en otros módulos
})
export class UsersModule { }
