import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) { }

  @Get()
  async findAll() {
    return await this.discountsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDiscountDto: CreateDiscountDto, @Req() req) {
    const userEmail = req.user.email;
    return await this.discountsService.create(createDiscountDto, userEmail);
  }
}