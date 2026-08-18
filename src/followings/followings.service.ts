import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateFollowingDto } from './dto/create-following.dto';
import { UpdateFollowingDto } from './dto/update-following.dto';

@Injectable()
export class FollowingsService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Followers" ORDER BY "createdAt" DESC');
        return result.rows;
    }

    async create(dto: CreateFollowingDto) {
        const { userId, following } = dto;
        const jsonFollowing = JSON.stringify(following || []);

        const result = await this.pool.query(
            'INSERT INTO "Followers" ("userId", following) VALUES ($1, $2::json) RETURNING *',
            [userId, jsonFollowing],
        );
        return result.rows[0];
    }

    async update(id: string, dto: UpdateFollowingDto) {
        const existing = await this.pool.query('SELECT * FROM "Followers" WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            throw new NotFoundException("Follower topilmadi!");
        }

        const current = existing.rows[0];
        const userId = dto.userId || current.userId;
        const following = dto.following ? JSON.stringify(dto.following) : JSON.stringify(current.following);

        const result = await this.pool.query(
            'UPDATE "Followers" SET "userId" = $1, following = $2::json WHERE id = $3 RETURNING *',
            [userId, following, id],
        );
        return result.rows[0];
    }

    async remove(id: string) {
        const existing = await this.pool.query('SELECT * FROM "Followers" WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            throw new NotFoundException("Follower topilmadi!");
        }

        const result = await this.pool.query('DELETE FROM "Followers" WHERE id = $1 RETURNING *', [id]);
        return { message: "Muvaffaqiyatli o'chirildi", deleted: result.rows[0] };
    }
}