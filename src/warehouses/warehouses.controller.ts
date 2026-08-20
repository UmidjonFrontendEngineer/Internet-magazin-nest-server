import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';

@Controller('warehouses')
export class WarehousesController {
    constructor(private readonly warehousesService: WarehousesService) { }

    @Get()
    async findAll() {
        return await this.warehousesService.findAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Req() req) {
        return await this.warehousesService.create(req.body);
    }
}