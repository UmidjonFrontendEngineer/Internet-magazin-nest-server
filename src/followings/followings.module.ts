import { Module } from '@nestjs/common';
import { FollowingsController } from './followings.controller';
import { FollowingsService } from './followings.service';

@Module({
    controllers: [FollowingsController],
    providers: [FollowingsService],
})
export class FollowingsModule { }