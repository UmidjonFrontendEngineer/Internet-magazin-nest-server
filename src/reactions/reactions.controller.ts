import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './reactions.dto';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get()
  async findAll() {
    return await this.reactionsService.findAll();
  }

  @Post()
  async create(@Body() createReactionDto: CreateReactionDto) {
    return await this.reactionsService.create(createReactionDto);
  }
}