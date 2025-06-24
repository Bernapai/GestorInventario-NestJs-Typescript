import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './users.entity';
import { UserCreateDto } from './dto/userCreate.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, name: 'Test' }] as User[];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.getAll();
      expect(result).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      const dto: UserCreateDto = {
        name: 'Test',
        email: 'test@example.com',
        password: '123456',
      };
      const newUser = { id: 1, ...dto } as User;

      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.register(dto);
      expect(result).toEqual(newUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe('getOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, name: 'Test' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.getOne(1);
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('findByName', () => {
    it('should return a user by name', async () => {
      const user = { id: 1, name: 'John' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findByName('John');
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'John' },
      });
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const dto: UserUpdateDto = { name: 'Updated' };
      const updatedUser = { id: 1, name: 'Updated' } as User;

      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.update(1, dto);
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, dto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('delete', () => {
    it('should return true if user is deleted', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete(1);
      expect(result).toBe(true);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return false if user is not found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.delete(999);
      expect(result).toBe(false);
    });
  });

  describe('findBByname', () => {
    it('should return user by name (duplicated method)', async () => {
      const user = { id: 1, name: 'Test' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findBByname('Test');
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Test' },
      });
    });
  });
});
