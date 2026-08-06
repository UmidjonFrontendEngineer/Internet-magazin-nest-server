import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Comments"');
    return result.rows;
  }

  async create(createCommentDto: CreateCommentDto) {
    const { productId, userId, text, rating = 5 } = createCommentDto;
    const result = await this.pool.query(
      'INSERT INTO "Comments" ("productId", "userId", text, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [productId, userId, text, rating],
    );
    return result.rows[0];
  }
}