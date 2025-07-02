import { Test, TestingModule } from '@nestjs/testing';
import { CategorysController } from 'src/categorys/controllers/categorys.controller';
import { CategorysService } from 'src/categorys/services/categorys.service';
import Categorys from '../../src/categorys/entities/categorys.entity';
import { CategoryCreateDto } from '../../src/categorys/dto/categorysCreate.dto';
import { CategoryUpdateDto } from '../../src/categorys/dto/categorysUpdate.dto';

describe('CategorysController', () => {
  let controller: CategorysController;

  const mockCategory: Categorys = {
    id: 1,
    name: 'Category Test',
    description: 'Category description',
    products: null,
  };

  const mockCategorysService = {
    getCategorys: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategorysController],
      providers: [
        {
          provide: CategorysService,
          useValue: mockCategorysService,
        },
      ],
    }).compile();

    controller = module.get<CategorysController>(CategorysController);
    jest.clearAllMocks();
  });

  describe('getCategorys', () => {
    it('should return an array of categories', async () => {
      mockCategorysService.getCategorys.mockResolvedValue([mockCategory]);
      const result = await controller.getCategorys();
      expect(result).toEqual([mockCategory]);
      expect(mockCategorysService.getCategorys).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a single category by id', async () => {
      mockCategorysService.getOne.mockResolvedValue(mockCategory);
      const result = await controller.getOne(1);
      expect(result).toEqual(mockCategory);
      expect(mockCategorysService.getOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a category', async () => {
      const dto: CategoryCreateDto = {
        name: 'New Category',
        description: 'New Description',
      };

      mockCategorysService.create.mockResolvedValue(mockCategory);
      const result = await controller.create(dto);
      expect(result).toEqual(mockCategory);
      expect(mockCategorysService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return the category', async () => {
      const dto: CategoryUpdateDto = { name: 'Updated Category' };
      const updatedCategory = { ...mockCategory, ...dto };
      mockCategorysService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update(1, dto);
      expect(result).toEqual(updatedCategory);
      expect(mockCategorysService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should delete a category by id', async () => {
      mockCategorysService.delete.mockResolvedValue(undefined);
      const result = await controller.delete(1);
      expect(result).toBeUndefined();
      expect(mockCategorysService.delete).toHaveBeenCalledWith(1);
    });
  });
});
