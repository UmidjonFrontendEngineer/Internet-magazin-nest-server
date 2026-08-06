import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { WherehousesService } from './wherehouses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWherehouseDto } from './dto/create-wherehouse.dto';

@Controller('wherehouses')
export class WherehousesController {
    constructor(private readonly wherehousesService: WherehousesService) { }

    @Get()
    async findAll() {
        return await this.wherehousesService.findAll();
    }

    @Post()
    async create(@Body() createWherehouseDto: CreateWherehouseDto) {
        return await this.wherehousesService.create(createWherehouseDto);
    }
}