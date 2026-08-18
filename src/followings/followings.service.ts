import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class FollowingsService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Followers" ORDER BY "createdAt" DESC');
        return result.rows;
    }

    async toggleFollow(marketId: string, userEmail: string) {
        const marketCheck = await this.pool.query('SELECT id FROM "Markets" WHERE id = $1', [marketId]);
        if (marketCheck.rows.length === 0) {
            throw new NotFoundException("Bunday market mavjud emas!");
        }

        const userQuery = await this.pool.query('SELECT id FROM "Users" WHERE email = $1', [userEmail]);
        if (userQuery.rows.length === 0) {
            throw new NotFoundException("Foydalanuvchi topilmadi!");
        }
        const userId = userQuery.rows[0].id;

        const followerQuery = await this.pool.query('SELECT * FROM "Followers" WHERE "userId" = $1', [userId]);

        let currentFollowing: string[] = [];

        if (followerQuery.rows.length === 0) {
            currentFollowing = [marketId];
            const jsonString = JSON.stringify(currentFollowing);

            const insertRes = await this.pool.query(
                'INSERT INTO "Followers" ("userId", following) VALUES ($1, $2::json) RETURNING *',
                [userId, jsonString]
            );
            return { message: "Follow qilindi", data: insertRes.rows[0] };
        } else {
            const row = followerQuery.rows[0];
            currentFollowing = Array.isArray(row.following) ? row.following : JSON.parse(row.following || '[]');

            const index = currentFollowing.indexOf(marketId);
            if (index > -1) {
                currentFollowing.splice(index, 1);
            } else {
                currentFollowing.push(marketId);
            }

            const jsonString = JSON.stringify(currentFollowing);
            const updateRes = await this.pool.query(
                'UPDATE "Followers" SET following = $1::json WHERE "userId" = $2 RETURNING *',
                [jsonString, userId]
            );

            return {
                message: index > -1 ? "Unfollow qilindi" : "Follow qilindi",
                data: updateRes.rows[0]
            };
        }
    }
}