import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../../src/products/controllers/products.controller';
import { ProductsService } from 'src/products/services/products.service';
import Product from '../../src/products/entities/products.entity';
import { ProductCreateDto } from '../../src/products/dto/productCreate.dto';
import { ProductUpdateDto } from '../../src/products/dto/productUpdate.dto';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockCategory = {
    id: 1,
    name: 'Category Test',
    description: 'Category description',
    products: [],
  };

  const mockSupplier = {
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
  });

  describe('getOne', () => {
    it('should return a single product by id', async () => {
      mockProductsService.getOne.mockResolvedValue(mockProduct);
      const result = await controller.getOne(1);
      expect(result).toEqual(mockProduct);
      expect(mockProductsService.getOne).toHaveBeenCalledWith(1);
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
  });

  describe('delete', () => {
    it('should delete a product by id', async () => {
      mockProductsService.delete.mockResolvedValue(undefined);
      const result = await controller.delete(1);
      expect(result).toBeUndefined();
      expect(mockProductsService.delete).toHaveBeenCalledWith(1);
    });
  });
});
