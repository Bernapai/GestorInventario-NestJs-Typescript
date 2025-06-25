import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import Suppliers from './suppliers.entity';
import { SupplierCreateDto } from './dto/suppliersCreate.dto';
import { SupplierUpdateDto } from './dto/suppliersUpdate.dto';

describe('SuppliersController', () => {
  let controller: SuppliersController;

  const mockSupplier: Suppliers = {
    id: 1,
    name: 'Proveedor Test',
    description: 'Descripción test',
    phone: '123-456-7890',
  };

  const mockSuppliersService = {
    getCallSites: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersController],
      providers: [
        {
          provide: SuppliersService,
          useValue: mockSuppliersService,
        },
      ],
    }).compile();

    controller = module.get<SuppliersController>(SuppliersController);

    jest.clearAllMocks();
  });

  describe('getCallSites', () => {
    it('should return a list of suppliers', async () => {
      mockSuppliersService.getCallSites.mockResolvedValue([mockSupplier]);

      const result = await controller.getCallSites();
      expect(result).toEqual([mockSupplier]);
      expect(mockSuppliersService.getCallSites).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a supplier by id', async () => {
      mockSuppliersService.getOne.mockResolvedValue(mockSupplier);

      const result = await controller.getOne(1);
      expect(result).toEqual(mockSupplier);
      expect(mockSuppliersService.getOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a new supplier', async () => {
      const dto: SupplierCreateDto = {
        name: 'Nuevo',
        description: 'Nuevo proveedor',
        phone: '987-654-3210',
      };

      mockSuppliersService.create.mockResolvedValue({ id: 2, ...dto });

      const result = await controller.create(dto);
      expect(result).toEqual({ id: 2, ...dto });
      expect(mockSuppliersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return the supplier', async () => {
      const dto: SupplierUpdateDto = { name: 'Actualizado' };
      const updated = { ...mockSupplier, ...dto };

      mockSuppliersService.update.mockResolvedValue(updated);

      const result = await controller.update(1, dto);
      expect(result).toEqual(updated);
      expect(mockSuppliersService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should call delete with given id', async () => {
      mockSuppliersService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(1);
      expect(result).toBeUndefined();
      expect(mockSuppliersService.delete).toHaveBeenCalledWith(1);
    });
  });
});
