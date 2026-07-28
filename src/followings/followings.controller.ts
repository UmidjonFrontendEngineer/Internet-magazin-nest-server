import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { FollowingsService } from './followings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('followings')
export class FollowingsController {
    constructor(private readonly followingsService: FollowingsService) { }

    @Get()
    async findAll() {
        return await this.followingsService.findAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() body: { userId: string; following: any[] }) {
        return await this.followingsService.create(body.userId, body.following);
    }
}