import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateReactionDto } from './reactions.dto';

@Injectable()
export class ReactionsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Reactions"');
    return result.rows;
  }

  async create(createReactionDto: CreateReactionDto) {
    const { reaction, product, profile } = createReactionDto;
    const result = await this.pool.query(
      'INSERT INTO "Reactions" (reaction, product, profile) VALUES ($1, $2, $3) RETURNING *',
      [reaction, product, profile],
    );
    return result.rows[0];
  }
}