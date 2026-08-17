import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class MarketAccessGuard implements CanActivate {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || (!user.id && !user.sub)) {
            throw new ForbiddenException('Foydalanuvchi autentifikatsiyadan o\'tmagan');
        }

        const userId = user.id || user.sub;
        let marketId = request.body?.marketId;

        const categoryId = request.params?.id;
        if (!marketId && categoryId) {
            const catRes = await this.pool.query('SELECT marketid FROM "Categories" WHERE id = $1', [categoryId]);
            if (catRes.rows.length === 0) {
                throw new NotFoundException('Kategoriya topilmadi');
            }
            marketId = catRes.rows[0].marketid;
        }

        if (!marketId) {
            throw new ForbiddenException('Market ID aniqlanmadi');
        }

        const marketRes = await this.pool.query(
            'SELECT * FROM "Markets" WHERE id = $1 AND userid = $2',
            [marketId, userId]
        );

        if (marketRes.rows.length > 0) {
            return true;
        }

        const workerRes = await this.pool.query(
            'SELECT * FROM "Workers" WHERE marketid = $1 AND userid = $2 AND role = ANY($3)',
            [marketId, userId, ['admin', 'owner']]
        );

        if (workerRes.rows.length > 0) {
            return true;
        }

        throw new ForbiddenException('Sizda bu marketda o\'zgartirish kiritish huquqi yo\'q');
    }
}