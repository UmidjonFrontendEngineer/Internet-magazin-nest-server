import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    async findAll() {
        return await this.categoriesService.findAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createDiscountDto: CreateCategoryDto, @Req() req) {
        const userEmail = req.user.email;
        return await this.categoriesService.create(createDiscountDto, userEmail);
    }
}