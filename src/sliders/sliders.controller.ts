import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) { }

  @Get()
  async findAll() {
    return await this.slidersService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createSliderDto: CreateSliderDto, @Req() req) {
    const userEmail = req.user.email;
    return await this.slidersService.create(createSliderDto, userEmail);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateSliderDto: UpdateSliderDto,
    @Req() req,
  ) {
    const userEmail = req.user.email;
    return await this.slidersService.update(id, updateSliderDto, userEmail);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req) {
    const userEmail = req.user.email;
    return await this.slidersService.remove(id, userEmail);
  }
}