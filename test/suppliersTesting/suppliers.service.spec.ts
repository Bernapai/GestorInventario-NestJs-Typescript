import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SuppliersService } from 'src/suppliers/services/suppliers.service';
import Suppliers from '../../src/suppliers/entities/suppliers.entity';
import { SupplierCreateDto } from '../../src/suppliers/dto/suppliersCreate.dto';
import { SupplierUpdateDto } from '../../src/suppliers/dto/suppliersUpdate.dto';

describe('SuppliersService', () => {
  let service: SuppliersService;

  const mockSupplier: Suppliers = {
    id: 1,
    name: 'Proveedor Uno',
    description: 'Proveedor de hardware',
    phone: '123-456-7890',
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
        SuppliersService,
        {
          provide: getRepositoryToken(Suppliers),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
    jest.clearAllMocks();
  });

  describe('getCallSites', () => {
    it('should return all suppliers', async () => {
      mockRepository.find.mockResolvedValue([mockSupplier]);
      const result = await service.getCallSites();
      expect(result).toEqual([mockSupplier]);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should throw if repository fails', async () => {
      mockRepository.find.mockRejectedValue(new Error('DB Error'));
      await expect(service.getCallSites()).rejects.toThrow('DB Error');
    });
  });

  describe('getOne', () => {
    it('should return a supplier by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockSupplier);
      const result = await service.getOne(1);
      expect(result).toEqual(mockSupplier);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if supplier not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await service.getOne(999);
      expect(result).toBeNull();
    });

    it('should throw if repository fails', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('FindOne error'));
      await expect(service.getOne(1)).rejects.toThrow('FindOne error');
    });
  });

  describe('create', () => {
    it('should create and return a supplier', async () => {
      const dto: SupplierCreateDto = {
        name: 'Nuevo Proveedor',
        description: 'Descripción',
        phone: '987-654-3210',
      };

      const createdSupplier = { id: 2, ...dto };

      mockRepository.create.mockReturnValue(createdSupplier as Suppliers);
      mockRepository.save.mockResolvedValue(createdSupplier as Suppliers);

      const result = await service.create(dto);
      expect(result).toEqual(createdSupplier);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(createdSupplier);
    });

    it('should throw if save fails', async () => {
      const dto: SupplierCreateDto = {
        name: 'Nuevo Proveedor',
        description: 'Descripción',
        phone: '987-654-3210',
      };

      const createdSupplier = { id: 2, ...dto };

      mockRepository.create.mockReturnValue(createdSupplier);
      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.create(dto)).rejects.toThrow('Save failed');
    });
  });

  describe('update', () => {
    it('should update and return the updated supplier', async () => {
      const dto: SupplierUpdateDto = {
        name: 'Proveedor Actualizado',
      };

      const updatedSupplier = {
        ...mockSupplier,
        ...dto,
      };

      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(updatedSupplier as Suppliers);

      const result = await service.update(1, dto);
      expect(result).toEqual(updatedSupplier);
      expect(mockRepository.update).toHaveBeenCalledWith({ id: 1 }, dto);
    });

    it('should throw if supplier not found after update', async () => {
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { name: 'X' })).rejects.toThrow(
        'Supplier with id 999 not found',
      );
    });

    it('should throw if update fails', async () => {
      mockRepository.update.mockRejectedValue(new Error('Update error'));

      await expect(service.update(1, { name: 'Error' })).rejects.toThrow('Update error');
    });
  });

  describe('delete', () => {
    it('should delete the supplier by id', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await service.delete(1);
      expect(mockRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw if delete fails', async () => {
      mockRepository.delete.mockRejectedValue(new Error('Delete error'));

      await expect(service.delete(1)).rejects.toThrow('Delete error');
    });
  });
});
