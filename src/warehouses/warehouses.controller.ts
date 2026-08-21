// import { Controller, Post, Body, Headers, UseGuards, Get } from '@nestjs/common';
// import { WarehousesService } from './warehouses.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { CreateWarehouseDto } from './dto/create-warehouse.dto';

// @Controller('warehouses')
// export class WarehousesController {
//     constructor(private readonly warehousesService: WarehousesService) { }

//     @Get()
//     async findAll() {
//         return await this.warehousesService.findAll()
//     }

//     @Post()
//     @UseGuards(JwtAuthGuard)
//     async create(
//         @Headers() headers: any,
//         @Body() body: CreateWarehouseDto
//     ) {
//         const validation = {
//             authorization: headers['authorization'] || headers['Authorization'],
//             marketId: headers['marketid'] || headers['marketId'],
//             role: headers['role'],
//         };

//         return await this.warehousesService.create(body, validation);
//     }
// }






import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('warehouses')
export class WarehousesController {
    constructor(private readonly warehousesService: WarehousesService) { }

    @Get()
    async findAll() {
        return await this.warehousesService.findAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createWarehouseDto: CreateWarehouseDto, @Req() req) {
        const userEmail = req.user.email;
        return await this.warehousesService.create(createWarehouseDto, userEmail);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateWarehouseDto: UpdateWarehouseDto,
        @Req() req,
    ) {
        const userEmail = req.user.email;
        return await this.warehousesService.update(id, updateWarehouseDto, userEmail);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @Req() req) {
        const userEmail = req.user.email;
        return await this.warehousesService.remove(id, userEmail);
    }
}