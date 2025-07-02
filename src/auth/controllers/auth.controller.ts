import { Controller, Post } from '@nestjs/common';
import { loginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(loginDto: loginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }
}
