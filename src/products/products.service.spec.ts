import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Product from './products.entity';
import { ProductCreateDto } from './dto/productCreate.dto';
import { ProductUpdateDto } from './dto/productUpdate.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockCategory = {
    id: 1,
    name: 'Cat Test',
    description: 'Category Description',
    products: [],
  };

  const mockSupplier = {
    id: 1,
    name: 'Supplier Test',
    description: 'Desc',
    phone: '123-456-7890',
  };

  const mockProduct: Product = {
    id: 1,
    name: 'Producto Test',
    description: 'Desc',
    price: 100,
    stock: 5,
    category: mockCategory,
    supplier: mockSupplier,
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
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all products', async () => {
      mockRepository.find.mockResolvedValue([mockProduct]);
      const result = await service.getAll();
      expect(result).toEqual([mockProduct]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a product by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProduct);
      const result = await service.getOne(1);
      expect(result).toEqual(mockProduct);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await service.getOne(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const dto: ProductCreateDto = {
        name: 'Nuevo Producto',
        description: 'Descripción',
        price: 200,
        stock: 10,
        categoryId: 1,
        supplierId: 1,
      };

      const createdProduct = {
        id: 2,
        ...dto,
        category: mockCategory,
        supplier: mockSupplier,
      };

      mockRepository.create.mockReturnValue(createdProduct as Product);
      mockRepository.save.mockResolvedValue(createdProduct as Product);

      const result = await service.create(dto);
      expect(result).toEqual(createdProduct);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(createdProduct);
    });
  });

  describe('update', () => {
    it('should update and return the updated product', async () => {
      const dto: ProductUpdateDto = { price: 150 };
      const updatedProduct = { ...mockProduct, ...dto };

      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(updatedProduct as Product);

      const result = await service.update(1, dto);
      expect(result).toEqual(updatedProduct);
      expect(mockRepository.update).toHaveBeenCalledWith({ id: 1 }, dto);
    });

    it('should throw error if product not found after update', async () => {
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { name: 'No existe' })).rejects.toThrow(
        'Product with id 1 not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete a product by id', async () => {
      mockRepository.delete.mockResolvedValue(undefined);
      await service.delete(1);
      expect(mockRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
