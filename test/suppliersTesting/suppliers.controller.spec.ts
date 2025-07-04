import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from 'src/suppliers/controllers/suppliers.controller';
import { SuppliersService } from 'src/suppliers/services/suppliers.service';
import Suppliers from '../../src/suppliers/entities/suppliers.entity';
import { SupplierCreateDto } from '../../src/suppliers/dto/suppliersCreate.dto';
import { SupplierUpdateDto } from '../../src/suppliers/dto/suppliersUpdate.dto';


// para que no bloquee tests
jest.mock('src/auth/jwt-auth.guard', () => ({
  JwtAuthGuard: class {
    canActivate() {
      return true;
    }
  },
}));

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

    it('should throw an error if service fails', async () => {
      mockSuppliersService.getCallSites.mockRejectedValue(new Error('Error al obtener proveedores'));

      await expect(controller.getCallSites()).rejects.toThrow('Error al obtener proveedores');
    });
  });

  describe('getOne', () => {
    it('should return a supplier by id', async () => {
      mockSuppliersService.getOne.mockResolvedValue(mockSupplier);

      const result = await controller.getOne(1);
      expect(result).toEqual(mockSupplier);
      expect(mockSuppliersService.getOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if service fails', async () => {
      mockSuppliersService.getOne.mockRejectedValue(new Error('Proveedor no encontrado'));

      await expect(controller.getOne(1)).rejects.toThrow('Proveedor no encontrado');
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

    it('should throw an error if creation fails', async () => {
      const dto: SupplierCreateDto = {
        name: 'Nuevo',
        description: 'Nuevo proveedor',
        phone: '987-654-3210',
      };

      mockSuppliersService.create.mockRejectedValue(new Error('Error al crear proveedor'));

      await expect(controller.create(dto)).rejects.toThrow('Error al crear proveedor');
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

    it('should throw an error if update fails', async () => {
      const dto: SupplierUpdateDto = { name: 'Actualizado' };

      mockSuppliersService.update.mockRejectedValue(new Error('Error al actualizar proveedor'));

      await expect(controller.update(1, dto)).rejects.toThrow('Error al actualizar proveedor');
    });
  });

  describe('delete', () => {
    it('should call delete with given id', async () => {
      mockSuppliersService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(1);
      expect(result).toBeUndefined();
      expect(mockSuppliersService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if deletion fails', async () => {
      mockSuppliersService.delete.mockRejectedValue(new Error('Error al eliminar proveedor'));

      await expect(controller.delete(1)).rejects.toThrow('Error al eliminar proveedor');
    });
  });
});