import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from '../../src/transactions/services/transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Transaction from '../../src/transactions/entities/transactions.entity';
import { TransactionCreateDto } from '../../src/transactions/dto/transactionsCreate.dto';
import { TransactionUpdateDto } from '../../src/transactions/dto/transactionsUpdate.dto';
import User from 'src/users/entities/users.entity';
import Product from 'src/products/entities/products.entity';
import Categorys from 'src/categorys/entities/categorys.entity';
import Suppliers from 'src/suppliers/entities/suppliers.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockTransactionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'user@example.com',
    password: '123456',
    role: 'user',
    createdAt: new Date(),
  };

  const mockCategory: Categorys = {
    id: 1,
    name: 'Category Test',
    description: 'A test category',
    products: [],
  };

  const mockSupplier: Suppliers = {
    id: 1,
    name: 'Supplier Test',
    description: 'A test supplier',
    phone: '123-456-7890',
  };

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'A product for testing',
    price: 99.99,
    stock: 100,
    category: mockCategory,
    supplier: mockSupplier,
  };

  const mockTransaction: Transaction = {
    id: 1,
    user: mockUser,
    product: mockProduct,
    quantity: 2,
    totalPrice: 199.98,
    date: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);

    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all transactions', async () => {
      mockTransactionRepository.find.mockResolvedValue([mockTransaction]);

      const result = await service.getAll();
      expect(result).toEqual([mockTransaction]);
      expect(mockTransactionRepository.find).toHaveBeenCalled();
    });

    it('should throw if repository throws', async () => {
      mockTransactionRepository.find.mockRejectedValue(new Error('DB error'));
      await expect(service.getAll()).rejects.toThrow('DB error');
    });
  });

  describe('getOne', () => {
    it('should return a transaction by id', async () => {
      mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.getOne(1);
      expect(result).toEqual(mockTransaction);
      expect(mockTransactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if not found', async () => {
      mockTransactionRepository.findOne.mockResolvedValue(null);

      const result = await service.getOne(999);
      expect(result).toBeNull();
    });

    it('should throw if repository throws', async () => {
      mockTransactionRepository.findOne.mockRejectedValue(new Error('DB error'));
      await expect(service.getOne(1)).rejects.toThrow('DB error');
    });
  });

  describe('create', () => {
    it('should create and return a new transaction', async () => {
      const dto: TransactionCreateDto = {
        userId: mockUser.id,
        productId: mockProduct.id,
        quantity: 3,
        totalPrice: 299.97,
        date: new Date(),
      };

      const created: Transaction = {
        id: 2,
        user: mockUser,
        product: mockProduct,
        quantity: dto.quantity,
        totalPrice: dto.totalPrice,
        date: dto.date,
      };

      mockTransactionRepository.create.mockReturnValue(created);
      mockTransactionRepository.save.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result).toEqual(created);
      expect(mockTransactionRepository.create).toHaveBeenCalledWith(dto);
      expect(mockTransactionRepository.save).toHaveBeenCalledWith(created);
    });

    it('should throw if repository throws on create', async () => {
      const dto: TransactionCreateDto = {
        userId: mockUser.id,
        productId: mockProduct.id,
        quantity: 3,
        totalPrice: 299.97,
        date: new Date(),
      };

      mockTransactionRepository.create.mockImplementation(() => { throw new Error('Create error'); });

      await expect(service.create(dto)).rejects.toThrow('Create error');
    });

    it('should throw if repository throws on save', async () => {
      const dto: TransactionCreateDto = {
        userId: mockUser.id,
        productId: mockProduct.id,
        quantity: 3,
        totalPrice: 299.97,
        date: new Date(),
      };

      const created: Transaction = {
        id: 2,
        user: mockUser,
        product: mockProduct,
        quantity: dto.quantity,
        totalPrice: dto.totalPrice,
        date: dto.date,
      };

      mockTransactionRepository.create.mockReturnValue(created);
      mockTransactionRepository.save.mockRejectedValue(new Error('Save error'));

      await expect(service.create(dto)).rejects.toThrow('Save error');
    });
  });

  describe('update', () => {
    it('should update and return transaction', async () => {
      const dto: TransactionUpdateDto = {
        quantity: 4,
        totalPrice: 399.96,
      };

      const updatedTransaction = { ...mockTransaction, ...dto };

      mockTransactionRepository.update.mockResolvedValue(undefined);
      mockTransactionRepository.findOne.mockResolvedValue(updatedTransaction);

      const result = await service.update(1, dto);
      expect(result).toEqual(updatedTransaction);
      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        dto,
      );
      expect(mockTransactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw if transaction not found after update', async () => {
      const dto: TransactionUpdateDto = {
        quantity: 10,
        totalPrice: 999.99,
      };

      mockTransactionRepository.update.mockResolvedValue(undefined);
      mockTransactionRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, dto)).rejects.toThrow(
        'Transaction with id 999 not found',
      );
    });

    it('should throw if repository throws on update', async () => {
      const dto: TransactionUpdateDto = {
        quantity: 4,
        totalPrice: 399.96,
      };

      mockTransactionRepository.update.mockRejectedValue(new Error('Update error'));

      await expect(service.update(1, dto)).rejects.toThrow('Update error');
    });

    it('should throw if repository throws on findOne after update', async () => {
      const dto: TransactionUpdateDto = {
        quantity: 4,
        totalPrice: 399.96,
      };

      mockTransactionRepository.update.mockResolvedValue(undefined);
      mockTransactionRepository.findOne.mockRejectedValue(new Error('FindOne error'));

      await expect(service.update(1, dto)).rejects.toThrow('FindOne error');
    });
  });

  describe('delete', () => {
    it('should delete the transaction', async () => {
      mockTransactionRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(1);
      expect(mockTransactionRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw if repository throws', async () => {
      mockTransactionRepository.delete.mockRejectedValue(new Error('Delete error'));
      await expect(service.delete(1)).rejects.toThrow('Delete error');
    });
  });
});
