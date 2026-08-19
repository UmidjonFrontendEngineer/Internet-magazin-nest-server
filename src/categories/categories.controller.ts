import { Controller, Get, Post, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Req } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MarketAccessGuard } from 'src/auth/market-access.guard';
import { Request } from 'express';

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
    create(@UploadedFiles() files: Express.Multer.File[], @Req() req: Request) {
        return this.categoriesService.create(req.body, files);
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