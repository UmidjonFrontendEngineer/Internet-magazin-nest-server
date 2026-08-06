import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateFollowingDto } from './dto/create-following.dto';

@Injectable()
export class FollowingsService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Followers"');
        return result.rows;
    }

    async create(userId: string, following: any[]) {
        const query = `
            INSERT INTO "Followers" ("userId", following) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        const values = [userId, JSON.stringify(following)];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }
}