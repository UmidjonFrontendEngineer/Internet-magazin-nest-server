import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateDiscountDto } from './dto/create-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Discounts"');
    return result.rows;
  }

  async create(createDiscountDto: CreateDiscountDto, userEmail: string) {
    const { title, percentage, startDate, endDate, market } = createDiscountDto;

    let isAuthorized = false;

    const marketOwnerCheck = await this.pool.query(
      'SELECT * FROM "Markets" WHERE id = $1 AND email = $2',
      [market, userEmail]
    );

    if (marketOwnerCheck.rows.length > 0) {
      isAuthorized = true;
    } else {
      const userQuery = await this.pool.query(
        'SELECT id FROM "Users" WHERE email = $1',
        [userEmail]
      );

      if (userQuery.rows.length > 0) {
        const userId = userQuery.rows[0].id;

        const workerCheck = await this.pool.query(
          'SELECT * FROM "Workers" WHERE "marketId" = $1 AND "userId" = $2',
          [market, userId]
        );

        if (workerCheck.rows.length > 0) {
          isAuthorized = true
        }
      }
    }

    if (!isAuthorized) {
      throw new ForbiddenException("Sizda bu do'konda chegirma yaratish huquqi yo'q!");
    }

    const finalStartDate = startDate || new Date();
    const finalEndDate = endDate || new Date();

    const result = await this.pool.query(
      'INSERT INTO "Discounts" (title, percentage, "startDate", "endDate", market) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, percentage, finalStartDate, finalEndDate, market],
    );

    return result.rows[0];
  }
}