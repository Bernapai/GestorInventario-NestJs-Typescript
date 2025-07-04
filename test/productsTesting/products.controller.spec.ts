import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../../src/products/controllers/products.controller';
import { ProductsService } from 'src/products/services/products.service';
import Product from '../../src/products/entities/products.entity';
import Categorys from 'src/categorys/entities/categorys.entity';
import Suppliers from 'src/suppliers/entities/suppliers.entity';
import { ProductCreateDto } from '../../src/products/dto/productCreate.dto';
import { ProductUpdateDto } from '../../src/products/dto/productUpdate.dto';

// para que no bloquee tests
jest.mock('src/auth/jwt-auth.guard', () => ({
  JwtAuthGuard: class {
    canActivate() {
      return true;
    }
  },
}));

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockCategory: Categorys = {
    id: 1,
    name: 'Category Test',
    description: 'Category description',
    products: [],
  };

  const mockSupplier: Suppliers = {
    id: 1,
    name: 'Supplier Test',
    description: 'Supplier description',
    phone: '123-456-7890',
  };

  const mockProduct: Product = {
    id: 1,
    name: 'Product Test',
    description: 'desc',
    price: 50,
    stock: 20,
    category: mockCategory,
    supplier: mockSupplier,
  };

  const mockProductsService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return an array of products', async () => {
      mockProductsService.getAll.mockResolvedValue([mockProduct]);
      const result = await controller.getAll();
      expect(result).toEqual([mockProduct]);
      expect(mockProductsService.getAll).toHaveBeenCalled();
    });

    it('should throw if service fails', async () => {
      mockProductsService.getAll.mockRejectedValue(new Error('Error al obtener productos'));
      await expect(controller.getAll()).rejects.toThrow('Error al obtener productos');
    });
  });

  describe('getOne', () => {
    it('should return a single product by id', async () => {
      mockProductsService.getOne.mockResolvedValue(mockProduct);
      const result = await controller.getOne(1);
      expect(result).toEqual(mockProduct);
      expect(mockProductsService.getOne).toHaveBeenCalledWith(1);
    });

    it('should throw if service fails', async () => {
      mockProductsService.getOne.mockRejectedValue(new Error('Producto no encontrado'));
      await expect(controller.getOne(1)).rejects.toThrow('Producto no encontrado');
    });
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const dto: ProductCreateDto = {
        name: 'Nuevo Producto',
        description: 'Descripción',
        price: 100,
        stock: 10,
        categoryId: 1,
        supplierId: 1,
      };

      mockProductsService.create.mockResolvedValue(mockProduct);
      const result = await controller.create(dto);
      expect(result).toEqual(mockProduct);
      expect(mockProductsService.create).toHaveBeenCalledWith(dto);
    });

    it('should throw if service fails on create', async () => {
      const dto: ProductCreateDto = {
        name: 'Nuevo Producto',
        description: 'Descripción',
        price: 100,
        stock: 10,
        categoryId: 1,
        supplierId: 1,
      };

      mockProductsService.create.mockRejectedValue(new Error('Error al crear producto'));
      await expect(controller.create(dto)).rejects.toThrow('Error al crear producto');
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const dto: ProductUpdateDto = { stock: 50 };
      const updatedProduct = { ...mockProduct, ...dto };

      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(1, dto);
      expect(result).toEqual(updatedProduct);
      expect(mockProductsService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw if service fails on update', async () => {
      mockProductsService.update.mockRejectedValue(new Error('Error al actualizar producto'));
      await expect(controller.update(1, { stock: 50 })).rejects.toThrow('Error al actualizar producto');
    });
  });

  describe('delete', () => {
    it('should delete a product by id', async () => {
      mockProductsService.delete.mockResolvedValue(undefined);
      const result = await controller.delete(1);
      expect(result).toBeUndefined();
      expect(mockProductsService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw if service fails on delete', async () => {
      mockProductsService.delete.mockRejectedValue(new Error('Error al eliminar producto'));
      await expect(controller.delete(1)).rejects.toThrow('Error al eliminar producto');
    });
  });
});
