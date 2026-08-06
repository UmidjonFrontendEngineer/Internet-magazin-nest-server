import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WherehousesService } from './wherehouses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWherehouseDto } from './dto/create-wherehouse.dto';

@Controller('wherehouse')
export class WherehousesController {
    constructor(private readonly vacanciesService: WherehousesService) { }

    @Get()
    async findAll() {
        return await this.vacanciesService.findAll();
    }
}