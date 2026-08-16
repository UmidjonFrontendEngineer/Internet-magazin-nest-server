import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Controller('workers')
export class WorkersController {
    constructor(private readonly workersService: WorkersService) { }

    @Get()
    async findAll() {
        return await this.workersService.findAll();
    }

    @Get('get')
    @UseGuards(JwtAuthGuard)
    async getMyMarkets(@Req() req) {
        return await this.workersService.findByUser(req.user.email);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() body: CreateWorkerDto) {
        return await this.workersService.create(body);
    }
}