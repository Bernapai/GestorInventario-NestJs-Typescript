import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Categorys from '../../src/categorys/entities/categorys.entity';
import { CategorysService } from 'src/categorys/services/categorys.service';
import { CategoryCreateDto } from '../../src/categorys/dto/categorysCreate.dto';
import { CategoryUpdateDto } from '../../src/categorys/dto/categorysUpdate.dto';

describe('CategorysService', () => {
  let service: CategorysService;

  const mockCategory: Categorys = {
    id: 1,
    name: 'Category Test',
    description: 'Category Description',
    products: null,
  };

  const mockRepository = {
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
        CategorysService,
        {
          provide: getRepositoryToken(Categorys),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategorysService>(CategorysService);
    jest.clearAllMocks();
  });

  describe('getCategorys', () => {
    it('should return all categories', async () => {
      mockRepository.find.mockResolvedValue([mockCategory]);
      const result = await service.getCategorys();
      expect(result).toEqual([mockCategory]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a category by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCategory);
      const result = await service.getOne(1);
      expect(result).toEqual(mockCategory);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await service.getOne(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a category', async () => {
      const dto: CategoryCreateDto = {
        name: 'New Category',
        description: 'New Description',
      };

      const createdCategory = {
        id: 2,
        ...dto,
        products: null,
      };

      mockRepository.create.mockReturnValue(createdCategory);
      mockRepository.save.mockResolvedValue(createdCategory);

      const result = await service.create(dto);
      expect(result).toEqual(createdCategory);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(createdCategory);
    });
  });

  describe('update', () => {
    it('should update and return the updated category', async () => {
      const dto: CategoryUpdateDto = { name: 'Updated Category' };
      const updatedCategory = { ...mockCategory, ...dto };

      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(updatedCategory);

      const result = await service.update(1, dto);
      expect(result).toEqual(updatedCategory);
      expect(mockRepository.update).toHaveBeenCalledWith({ id: 1 }, dto);
    });

    it('should throw error if category not found after update', async () => {
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { name: 'No exist' })).rejects.toThrow(
        'Category with id 1 not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete a category by id', async () => {
      mockRepository.delete.mockResolvedValue(undefined);
      await service.delete(1);
      expect(mockRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
