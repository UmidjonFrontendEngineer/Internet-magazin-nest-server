import { Controller, Get, Post, Body } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './shops.dto';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  async findAll() {
    return await this.shopsService.findAll();
  }

  @Post()
  async create(@Body() createShopDto: CreateShopDto) {
    return await this.shopsService.create(createShopDto);
  }
}