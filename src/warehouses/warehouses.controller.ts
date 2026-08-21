import { Controller, Post, Body, Headers, UseGuards, Get } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';

@Controller('warehouses')
export class WarehousesController {
    constructor(private readonly warehousesService: WarehousesService) { }

    @Get()
    async findAll() {
        return await this.warehousesService.findAll()
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Headers() headers: any,
        @Body() body: CreateWarehouseDto
    ) {
        const validation = {
            authorization: headers['authorization'],
            marketId: headers['marketid'],
            role: headers['role'],
        };

        return await this.warehousesService.create(body, validation);
    }
}