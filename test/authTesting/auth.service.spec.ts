import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/services/auth.service';
import { loginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import User from 'src/users/entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService', () => {
    let service: AuthService;

    const mockUser: User = {
        id: 1,
        name: 'testuser',
        password: 'testpassword',
        email: 'juane@gmail.com',
        role: 'ADMIN',
        createdAt: new Date(),
    };

    const mockRepository = {
        login: jest.fn(),
        register: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return a token on successful login', async () => {
            const loginData: loginDto = { name: mockUser.name, password: mockUser.password };
            const mockToken = { accessToken: 'jwt-token' };
            mockRepository.login.mockResolvedValue(mockToken);

            const result = await service.login(loginData);
            expect(result).toEqual(mockToken);
            expect(mockRepository.login).toHaveBeenCalledWith(loginData);
        });

        it('should throw if service throws', async () => {
            const loginData: loginDto = { name: mockUser.name, password: mockUser.password };
            mockRepository.login.mockRejectedValue(new Error('Login error'));

            await expect(service.login(loginData)).rejects.toThrow('Login error');
        });
    });

    describe('register', () => {
        it('should return the registered user', async () => {
            const registerData: RegisterDto = { name: mockUser.name, password: mockUser.password, email: mockUser.email };
            mockRepository.register.mockResolvedValue(mockUser);

            const result = await service.register(registerData);
            expect(result).toEqual(mockUser);
            expect(mockRepository.register).toHaveBeenCalledWith(registerData);
        });

        it('should throw if service throws', async () => {
            const registerData: RegisterDto = { name: mockUser.name, password: mockUser.password, email: mockUser.email };
            mockRepository.register.mockRejectedValue(new Error('Registration error'));

            await expect(service.register(registerData)).rejects.toThrow('Registration error');
        });
    });

}
)