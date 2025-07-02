import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from '../../src/transactions/controllers/transactions.controller';
import { TransactionsService } from '../../src/transactions/services/transactions.service';
import Transaction from '../../src/transactions/entities/transactions.entity';
import { TransactionCreateDto } from '../../src/transactions/dto/transactionsCreate.dto';
import { TransactionUpdateDto } from '../../src/transactions/dto/transactionsUpdate.dto';

// para que no bloquee tests
jest.mock('src/auth/jwt-auth.guard', () => ({
  JwtAuthGuard: class {
    canActivate() {
      return true;
    }
  },
}));

describe('TransactionsController', () => {
  let controller: TransactionsController;

  const mockSupplier = {
    id: 1,
    name: 'Supplier Test',
    description: 'Supplier description',
    phone: '123-456-7890',
  };

  const mockCategory = {
    id: 1,
    name: 'Category Test',
    description: 'Category description',
    products: [],
  };

  const mockProduct = {
    id: 1,
    name: 'Product Test',
    description: 'desc',
    price: 50,
    stock: 20,
    category: mockCategory,
    supplier: mockSupplier,
  };

  const mockUser = {
    id: 1,
    name: 'User Test',
    email: 'test@example.com',
    password: '123456',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransaction: Transaction = {
    id: 1,
    user: mockUser,
    product: mockProduct,
    quantity: 2,
    totalPrice: 100,
    date: new Date(),
  };

  const mockTransactionsService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);

    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all transactions', async () => {
      mockTransactionsService.getAll.mockResolvedValue([mockTransaction]);

      const result = await controller.getAll();
      expect(result).toEqual([mockTransaction]);
      expect(mockTransactionsService.getAll).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a transaction by id', async () => {
      mockTransactionsService.getOne.mockResolvedValue(mockTransaction);

      const result = await controller.getOne(1);
      expect(result).toEqual(mockTransaction);
      expect(mockTransactionsService.getOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a new transaction', async () => {
      const dto: TransactionCreateDto = {
        userId: mockUser.id,
        productId: mockProduct.id,
        quantity: 3,
        totalPrice: 150,
        date: new Date(),
      };

      mockTransactionsService.create.mockResolvedValue(mockTransaction);

      const result = await controller.create(dto);
      expect(result).toEqual(mockTransaction);
      expect(mockTransactionsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return transaction', async () => {
      const dto: TransactionUpdateDto = {
        quantity: 5,
        totalPrice: 250,
      };

      const updatedTransaction = { ...mockTransaction, ...dto };

      mockTransactionsService.update.mockResolvedValue(updatedTransaction);

      const result = await controller.update(1, dto);
      expect(result).toEqual(updatedTransaction);
      expect(mockTransactionsService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should delete transaction', async () => {
      mockTransactionsService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(1);
      expect(result).toBeUndefined();
      expect(mockTransactionsService.delete).toHaveBeenCalledWith(1);
    });
  });
});
