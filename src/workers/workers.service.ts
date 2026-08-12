import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Injectable()
export class WorkersService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Workers"');
        return result.rows;
    }

    async create(worker: CreateWorkerDto & { vacancyId: string }) {
        const vacancyQuery = await this.pool.query(
            'SELECT "requiredRole" FROM "Vacancies" WHERE id = $1',
            [worker.vacancyId]
        );

        if (vacancyQuery.rows.length === 0) {
            throw new NotFoundException('Vakansiya topilmadi!');
        }

        const role = vacancyQuery.rows[0].requiredRole;

        const query = `
            INSERT INTO "Workers" ("userEmail", "marketId", role, "vacancyId") 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;

        const values = [
            worker.userEmail,
            worker.marketId,
            role,
            worker.vacancyId
        ];

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }
}