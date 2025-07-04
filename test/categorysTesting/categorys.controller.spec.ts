import { Test, TestingModule } from '@nestjs/testing';
import { CategorysController } from 'src/categorys/controllers/categorys.controller';
import { CategorysService } from 'src/categorys/services/categorys.service';
import Categorys from '../../src/categorys/entities/categorys.entity';
import { CategoryCreateDto } from '../../src/categorys/dto/categorysCreate.dto';
import { CategoryUpdateDto } from '../../src/categorys/dto/categorysUpdate.dto';

// para que no bloquee tests
jest.mock('src/auth/jwt-auth.guard', () => ({
  JwtAuthGuard: class {
    canActivate() {
      return true;
    }
  },
}));

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

    it('should throw if service fails', async () => {
      mockCategorysService.getCategorys.mockRejectedValue(new Error('Error al obtener categorías'));
      await expect(controller.getCategorys()).rejects.toThrow('Error al obtener categorías');
    });
  });

  describe('getOne', () => {
    it('should return a single category by id', async () => {
      mockCategorysService.getOne.mockResolvedValue(mockCategory);
      const result = await controller.getOne(1);
      expect(result).toEqual(mockCategory);
      expect(mockCategorysService.getOne).toHaveBeenCalledWith(1);
    });

    it('should throw if service fails', async () => {
      mockCategorysService.getOne.mockRejectedValue(new Error('Categoría no encontrada'));
      await expect(controller.getOne(1)).rejects.toThrow('Categoría no encontrada');
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

    it('should throw if service fails', async () => {
      const dto: CategoryCreateDto = {
        name: 'New Category',
        description: 'New Description',
      };

      mockCategorysService.create.mockRejectedValue(new Error('Error al crear categoría'));
      await expect(controller.create(dto)).rejects.toThrow('Error al crear categoría');
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

    it('should throw if service fails', async () => {
      mockCategorysService.update.mockRejectedValue(new Error('Error al actualizar categoría'));
      await expect(controller.update(1, { name: 'Fail' })).rejects.toThrow('Error al actualizar categoría');
    });
  });

  describe('delete', () => {
    it('should delete a category by id', async () => {
      mockCategorysService.delete.mockResolvedValue(undefined);
      const result = await controller.delete(1);
      expect(result).toBeUndefined();
      expect(mockCategorysService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw if service fails', async () => {
      mockCategorysService.delete.mockRejectedValue(new Error('Error al eliminar categoría'));
      await expect(controller.delete(1)).rejects.toThrow('Error al eliminar categoría');
    });
  });
});
