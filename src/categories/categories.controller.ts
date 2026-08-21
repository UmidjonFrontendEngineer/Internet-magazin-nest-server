import { Controller, Get, Post, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Req, BadRequestException } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MarketAccessGuard } from '../auth/market-access.guard';
import type { Request } from 'express';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard, MarketAccessGuard)
    @UseInterceptors(AnyFilesInterceptor())
    async create(@UploadedFiles() files: Express.Multer.File[], @Req() req: Request) {
        const body = req.body;
        if (!body) {
            throw new BadRequestException('FormData maʼlumotlari kelmadi');
        }
        return this.categoriesService.create(body, files || []);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, MarketAccessGuard)
    @UseInterceptors(AnyFilesInterceptor())
    update(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[], @Req() req: Request) {
        return this.categoriesService.update(id, req.body, files);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, MarketAccessGuard)
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}