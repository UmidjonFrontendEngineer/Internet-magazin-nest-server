import { Controller, Get, Post, Body } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './discounts.dto';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  async findAll() {
    return await this.discountsService.findAll();
  }

  @Post()
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return await this.discountsService.create(createDiscountDto);
  }
}