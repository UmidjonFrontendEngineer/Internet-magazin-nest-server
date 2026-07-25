import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateDiscountDto } from './discounts.dto';

@Injectable()
export class DiscountsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Discounts"');
    return result.rows;
  }

  async create(createDiscountDto: CreateDiscountDto) {
    const { title, percentage, startDate, endDate, shop } = createDiscountDto;

    const result = await this.pool.query(
      'INSERT INTO "Discounts" (title, percentage, "startDate", "endDate", shop) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, percentage, startDate, endDate, shop],
    );

    return result.rows[0];
  }
}