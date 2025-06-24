import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto/userCreate.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';
import User from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser: User = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    password: 'secure123',
    role: 'user',
    createdAt: new Date(),
  };

  const mockUsersService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    register: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      mockUsersService.getAll.mockResolvedValue([mockUser]);

      const result = await controller.getAll();
      expect(result).toEqual([mockUser]);
      expect(mockUsersService.getAll).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return user by id', async () => {
      mockUsersService.getOne.mockResolvedValue(mockUser);

      const result = await controller.getOne(1);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.getOne).toHaveBeenCalledWith(1);
    });
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      const dto: UserCreateDto = {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secure123',
      };

      mockUsersService.register.mockResolvedValue(mockUser);

      const result = await controller.register(dto);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const dto: UserUpdateDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newpass123',
      };

      const updatedUser = { ...mockUser, ...dto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(1, dto);
      expect(result).toEqual(updatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should delete user and return true', async () => {
      mockUsersService.delete.mockResolvedValue(true);

      const result = await controller.delete(1);
      expect(result).toBe(true);
      expect(mockUsersService.delete).toHaveBeenCalledWith(1);
    });

    it('should return false if user not found', async () => {
      mockUsersService.delete.mockResolvedValue(false);

      const result = await controller.delete(999);
      expect(result).toBe(false);
    });
  });
});
