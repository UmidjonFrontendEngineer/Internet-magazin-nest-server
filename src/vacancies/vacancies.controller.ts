import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFile, Delete, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VacanciesService } from './vacancies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

@Controller('vacancies')
export class VacanciesController {
    constructor(private readonly vacanciesService: VacanciesService) { }

    @Get()
    async findAll() {
        return await this.vacanciesService.findAll();
    }

    @Get('market/:marketId')
    async findByMarketId(@Param('marketId') marketId: string) {
        return await this.vacanciesService.findByMarketId(marketId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @UploadedFile() file: { buffer: Buffer; originalname: string },
        @Body() body: CreateVacancyDto
    ) {
        return await this.vacanciesService.create(body, file);
    }

    @Post(':id/apply')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async applyToVacancy(
        @Param('id') vacancyId: string,
        @Req() req,
        @UploadedFile() file?: { buffer: Buffer; originalname: string },
        @Body() body?: { message?: string }
    ) {
        const userEmail = req.user.email;
        const message = body?.message || '';

        return await this.vacanciesService.applyToVacancy(vacancyId, userEmail, file, message);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @Req() req) {
        const userEmail = req.user.email;

        return await this.vacanciesService.remove(id, userEmail);
    }

    @Post(':id/rate')
    @UseGuards(JwtAuthGuard)
    async rateToVacancy(
        @Param('id') vacancyId: string,
        @Body() body: { rateCount: number; targetEmail: string }
    ) {
        return await this.vacanciesService.rateToVacancy(vacancyId, body.targetEmail, body.rateCount);
    }
}