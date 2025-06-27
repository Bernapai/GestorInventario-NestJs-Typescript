import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import Transaction from './transactions.entity';
import { TransactionCreateDto } from './dto/transactionsCreate.dto';
import { TransactionUpdateDto } from './dto/transactionsUpdate.dto';
import { AuthGuard } from 'src/auth/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Transactions')
@UseGuards(AuthGuard) // Protege todas las rutas con JWT
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transacciones obtenida correctamente',
    type: [Transaction],
  })
  async getAll(): Promise<Transaction[]> {
    return await this.transactionsService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una transacción por ID' })
  @ApiResponse({
    status: 200,
    description: 'Transacción obtenida correctamente',
    type: Transaction,
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async getOne(@Param('id') id: number): Promise<Transaction | null> {
    return await this.transactionsService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva transacción' })
  @ApiResponse({
    status: 201,
    description: 'Transacción creada correctamente',
    type: Transaction,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() data: TransactionCreateDto): Promise<Transaction> {
    return await this.transactionsService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una transacción por ID' })
  @ApiResponse({
    status: 200,
    description: 'Transacción actualizada correctamente',
    type: Transaction,
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async update(
    @Param('id') id: number,
    @Body() data: TransactionUpdateDto,
  ): Promise<Transaction> {
    return await this.transactionsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una transacción por ID' })
  @ApiResponse({
    status: 200,
    description: 'Transacción eliminada correctamente',
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this.transactionsService.delete(id);
  }
}
