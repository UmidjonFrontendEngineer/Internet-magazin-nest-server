import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class MarketAccessGuard implements CanActivate {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.email) {
            throw new ForbiddenException('Foydalanuvchi autentifikatsiyadan o\'tmagan');
        }

        const email = user.email;

        const userRes = await this.pool.query('SELECT id FROM "Users" WHERE email = $1', [email]);
        const userId = userRes.rows.length > 0 ? userRes.rows[0].id : null;

        let marketId = request.body?.marketId || request.query?.marketId;
        const categoryId = request.params?.id;

        if (!marketId && categoryId) {
            const catRes = await this.pool.query('SELECT "marketId" FROM "Categories" WHERE id = $1', [categoryId]);
            if (catRes.rows.length === 0) {
                throw new NotFoundException('Kategoriya topilmadi');
            }
            marketId = catRes.rows[0].marketId;
        }

        if (!marketId) {
            marketId = request.headers['marketid'] || request.headers['market-id'];
        }

        if (!marketId) {
            throw new ForbiddenException('Market ID aniqlanmadi');
        }

        const marketRes = await this.pool.query(
            'SELECT * FROM "Markets" WHERE id = $1 AND email = $2',
            [marketId, email]
        );

        if (marketRes.rows.length > 0) {
            return true;
        }

        if (userId) {
            const workerRes = await this.pool.query(
                'SELECT * FROM "Workers" WHERE "marketId" = $1 AND "userId" = $2 AND role = ANY($3)',
                [marketId, userId, ['admin', 'owner']]
            );

            if (workerRes.rows.length > 0) {
                return true;
            }
        }

        throw new ForbiddenException('Sizda bu marketda o\'zgartirish kiritish huquqi yo\'q');
    }
}