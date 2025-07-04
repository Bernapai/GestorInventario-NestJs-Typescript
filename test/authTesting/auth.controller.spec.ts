import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/controllers/auth.controller';
import { AuthService } from '../../src/auth/services/auth.service';
import { loginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import User from 'src/users/entities/users.entity';

describe('AuthController', () => {
    let controller: AuthController;

    const mockUser: User = {
        id: 1,
        name: 'testuser',
        password: 'testpassword',
        email: 'juane@gmail.com',
        role: 'ADMIN',
        createdAt: new Date(),
    };

    const mockAuthService = {
        login: jest.fn(),
        register: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return a token on successful login', async () => {
            const loginData: loginDto = { name: mockUser.name, password: mockUser.password };
            const mockToken = { accessToken: 'jwt-token' };
            mockAuthService.login.mockResolvedValue(mockToken);

            const result = await controller.login(loginData);
            expect(result).toEqual(mockToken);
            expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
        });

        it('should throw if service throws', async () => {
            const loginData: loginDto = { name: mockUser.name, password: mockUser.password };
            mockAuthService.login.mockRejectedValue(new Error('Login error'));

            await expect(controller.login(loginData)).rejects.toThrow('Login error');
        });
    });

    describe('register', () => {
        it('should return the registered user', async () => {
            const registerData: RegisterDto = {
                name: mockUser.name,
                password: mockUser.password,
                email: mockUser.email,
            };
            const mockResult = { id: 1, ...registerData };
            mockAuthService.register.mockResolvedValue(mockResult);

            const result = await controller.register(registerData);
            expect(result).toEqual(mockResult);
            expect(mockAuthService.register).toHaveBeenCalledWith(registerData);
        });

        it('should throw if service throws', async () => {
            const registerData: RegisterDto = {
                name: mockUser.name,
                password: mockUser.password,
                email: mockUser.email,
            };
            mockAuthService.register.mockRejectedValue(new Error('Register error'));

            await expect(controller.register(registerData)).rejects.toThrow('Register error');
        });
    });
});






