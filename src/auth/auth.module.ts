import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: 'JksIJ093jJS', // Cambiar por una variable de entorno
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
