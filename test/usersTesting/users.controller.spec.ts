import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/controllers/users.controller';
import { UsersService } from '../../src/users/services/users.service';
import { UserCreateDto } from '../../src/users/dto/userCreate.dto';
import { UserUpdateDto } from '../../src/users/dto/userUpdate.dto';
import User from '../../src/users/entities/users.entity';

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
    it('should return an array of users', async () => {
      mockUsersService.getAll.mockResolvedValue([mockUser]);
      const result = await controller.getAll();
      expect(result).toEqual([mockUser]);
      expect(mockUsersService.getAll).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockUsersService.getAll.mockRejectedValue(new Error('DB error'));
      await expect(controller.getAll()).rejects.toThrow('DB error');
    });
  });

  describe('getOne', () => {
    it('should return a user by id', async () => {
      mockUsersService.getOne.mockResolvedValue(mockUser);
      const result = await controller.getOne(1);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.getOne).toHaveBeenCalledWith(1);
    });

    it('should return null if user not found', async () => {
      mockUsersService.getOne.mockResolvedValue(null);
      const result = await controller.getOne(999);
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      mockUsersService.getOne.mockRejectedValue(new Error('DB error'));
      await expect(controller.getOne(1)).rejects.toThrow('DB error');
    });
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      const dto: UserCreateDto = {
        name: 'Bob',
        email: 'bob@example.com',
        password: 'pass123',
      };
      mockUsersService.register.mockResolvedValue(mockUser);
      const result = await controller.register(dto);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.register).toHaveBeenCalledWith(dto);
    });

    it('should handle errors', async () => {
      mockUsersService.register.mockRejectedValue(new Error('Validation error'));
      await expect(controller.register({ name: '', email: '', password: '' })).rejects.toThrow('Validation error');
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const dto: UserUpdateDto = { name: 'Alice Updated' };
      mockUsersService.update.mockResolvedValue({ ...mockUser, ...dto });
      const result = await controller.update(1, dto);
      expect(result).toEqual({ ...mockUser, ...dto });
      expect(mockUsersService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should return null if user not found', async () => {
      mockUsersService.update.mockResolvedValue(null);
      const result = await controller.update(999, { name: 'No User' });
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      mockUsersService.update.mockRejectedValue(new Error('Update error'));
      await expect(controller.update(1, { name: 'err' })).rejects.toThrow('Update error');
    });
  });

  describe('delete', () => {
    it('should return true if user deleted', async () => {
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

    it('should handle errors', async () => {
      mockUsersService.delete.mockRejectedValue(new Error('Delete error'));
      await expect(controller.delete(1)).rejects.toThrow('Delete error');
    });
  });
});

