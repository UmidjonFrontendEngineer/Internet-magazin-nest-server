import { Controller, Get, Post, Body } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';

@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}

  @Get()
  async findAll() {
    return await this.slidersService.findAll();
  }

  @Post()
  async create(@Body() createSliderDto: CreateSliderDto) {
    return await this.slidersService.create(createSliderDto);
  }
}