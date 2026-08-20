import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';

@Injectable()
export class WarehousesService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Warehouses"');
        return result.rows;
    }

    async create(warehouser: CreateWarehouseDto) {
        const { title, lat, lng, email, marketId } = warehouser;

        const result = await this.pool.query(
            'INSERT INTO "Warehouses" (title, email, "marketId", lat, lng) VALUES ($1, $2, $3) RETURNING *',
            [title, email, marketId, lat, lng],
        );
        return result.rows[0];
    }
}