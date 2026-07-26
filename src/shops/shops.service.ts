import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateShopDto } from './shops.dto';

@Injectable()
export class ShopsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Shops"');
    return result.rows;
  }

  async create(createShopDto: CreateShopDto) {
    const { userName, title, logo, password } = createShopDto;
    const result = await this.pool.query(
      'INSERT INTO "Shops" ("userName", title, logo, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [userName, title, logo, password],
    );
    return result.rows[0];
  }
}