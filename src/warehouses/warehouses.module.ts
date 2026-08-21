import { Module } from '@nestjs/common';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'super-secret-key',
        }),
    ],
    controllers: [WarehousesController],
    providers: [WarehousesService],
})
export class WarehousesModule { }