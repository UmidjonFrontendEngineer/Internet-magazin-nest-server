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

    async findByUser(email: string) {
        const query = 'SELECT m.*, w.role FROM "Markets" m JOIN "Workers" w ON m.id = w."marketId" JOIN "Users" u ON w."userId"::uuid = u.id WHERE u.email = $1';
        const result = await this.pool.query(query, [email]);
        return result.rows;
    }

    async create(worker: CreateWorkerDto & { vacancyId: string }) {
        const vacancyQuery = await this.pool.query(
            'SELECT "requiredRole", "salary" FROM "Vacancies" WHERE id = $1',
            [worker.vacancyId]
        );

        if (vacancyQuery.rows.length === 0) {
            throw new NotFoundException('Vakansiya topilmadi!');
        }

        const role = vacancyQuery.rows[0].requiredRole;
        const salary = vacancyQuery.rows[0].salary;

        const query = `
            INSERT INTO "Workers" ("userId", "marketId", "role", "vacancyId", "salary") 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *;
        `;

        const values = [
            worker.userId,
            worker.marketId,
            role,
            worker.vacancyId,
            salary
        ];

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }
}