import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateFeatureRequestDto } from './dto/feature-request.dto';

@Injectable()
export class FeatureRequestsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "FeatureRequests"');
    return result.rows;
  }

  async create(createFeatureRequestDto: CreateFeatureRequestDto) {
    const { name, phone, product, title } = createFeatureRequestDto;
    const result = await this.pool.query(
      'INSERT INTO "FeatureRequests" (name, phone, product, title) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, phone, product, title],
    );
    return result.rows[0];
  }
}