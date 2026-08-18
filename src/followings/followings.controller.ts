import { Controller, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { FollowingsService } from './followings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('followings')
export class FollowingsController {
    constructor(private readonly followingsService: FollowingsService) { }

    @Get()
    async findAll() {
        return await this.followingsService.findAll();
    }

    @Patch(':marketId')
    @UseGuards(JwtAuthGuard)
    async toggleFollow(
        @Param('marketId') marketId: string,
        @Req() req,
    ) {
        const userEmail = req.user.email;
        return await this.followingsService.toggleFollow(marketId, userEmail);
    }
}