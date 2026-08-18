import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { FollowingsService } from './followings.service';
import { CreateFollowingDto } from './dto/create-following.dto';
import { UpdateFollowingDto } from './dto/update-following.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('followings')
export class FollowingsController {
    constructor(private readonly followingsService: FollowingsService) { }

    @Get()
    async findAll() {
        return await this.followingsService.findAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createFollowerDto: CreateFollowingDto, @Req() req) {
        return await this.followingsService.create(createFollowerDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateFollowerDto: UpdateFollowingDto) {
        return await this.followingsService.update(id, updateFollowerDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
        return await this.followingsService.remove(id);
    }
}