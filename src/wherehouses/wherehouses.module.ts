import { Module } from '@nestjs/common';
import { WherehousesController } from './wherehouses.controller';
import { WherehousesService } from './wherehouses.service';

@Module({
    controllers: [WherehousesController],
    providers: [WherehousesService],
})
export class WherehousesModule { }