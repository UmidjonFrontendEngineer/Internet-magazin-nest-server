import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
    @Req() req,
  ) {
    const userEmail = req.user.email;
    return await this.discountsService.update(id, updateDiscountDto, userEmail);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req) {
    const userEmail = req.user.email;
    return await this.discountsService.remove(id, userEmail);
  }
}