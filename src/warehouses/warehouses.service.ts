import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { JwtService } from '@nestjs/jwt';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { validateMarketRole } from '../common/helpers/market-role.helper';

@Injectable()
export class WarehousesService {
    constructor(
        @Inject('DATABASE_POOL') private pool: Pool,
        private jwtService: JwtService
    ) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Warehouses"');
        return result.rows;
    }

    async create(warehouser: CreateWarehouseDto, validation: any) {
        await validateMarketRole(this.pool, this.jwtService, validation);

        const { title, lat, lng, marketId } = warehouser;

        const result = await this.pool.query(
            'INSERT INTO "Warehouses" (title, "marketId", lat, lng) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, marketId, lat, lng],
        );
        return result.rows[0];
    }
}