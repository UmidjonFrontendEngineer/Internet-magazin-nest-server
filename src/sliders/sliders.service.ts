import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateSliderDto } from './sliders.dto';

@Injectable()
export class SlidersService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Sliders"');
    return result.rows;
  }

  async create(createSliderDto: CreateSliderDto) {
    const { image_url, link, shop } = createSliderDto;
    const result = await this.pool.query(
      'INSERT INTO "Sliders" (image_url, link, shop) VALUES ($1, $2, $3) RETURNING *',
      [image_url, link, shop],
    );
    return result.rows[0];
  }
}