import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Controller('workers')
export class WorkersController {
    constructor(private readonly workersService: WorkersService) { }

    @Get()
    async findAll() {
        return await this.workersService.findAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() body: CreateWorkerDto) {
        return await this.workersService.create(body);
    }
}