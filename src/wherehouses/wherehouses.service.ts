import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateWherehouseDto } from './dto/create-wherehouse.dto';

@Injectable()
export class WherehousesService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Wherehouses"');
        return result.rows;
    }

    async create(createWherehouseDto: CreateWherehouseDto) {
        const { email, lat, lng } = createWherehouseDto;

        const result = await this.pool.query(
            'INSERT INTO "Wherehouses" (email, lat, lng) VALUES ($1, $2, $3) RETURNING *',
            [email, lat, lng],
        );
        return result.rows[0];
    }
}