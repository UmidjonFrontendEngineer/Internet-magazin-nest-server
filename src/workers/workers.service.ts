import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Injectable()
export class WorkersService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Workers"');
        return result.rows;
    }

    async create(worker: CreateWorkerDto) {
        const query = `
            INSERT INTO "Workers" ("userEmail", "shopId", "role") 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const values = [
            worker.userEmail,
            worker.shopId,
            worker.role
        ];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }
}