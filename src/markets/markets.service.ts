import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateMarketDto } from './dto/create-market.dto';

@Injectable()
export class MarketsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Markets"');
    return result.rows
  }

  async findByUser(email: string) {
    const query = 'SELECT * FROM "Markets" WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows;
  }

  async create(createMarketDto: { title: string; logo: string; lat: number; lng: number }, email: string) {
    const { title, logo, lat, lng } = createMarketDto;

    const result = await this.pool.query(
      'INSERT INTO "Markets" (email, title, logo, lat, lng) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, title, logo, lat, lng],
    );

    return result.rows[0];
  }

  async remove(id: string, email: string) {
    const check = await this.pool.query(
      'SELECT * FROM "Markets" WHERE id = $1 AND email = $2',
      [id, email],
    );

    if (check.rows.length === 0) {
      throw new Error('Do\'kon topilmadi yoki uni o\'chirishga huquqingiz yo\'q!');
    }

    const result = await this.pool.query(
      'DELETE FROM "Markets" WHERE id = $1 RETURNING *',
      [id],
    );

    return { message: 'Do\'kon muvaffaqiyatli o\'chirildi', deletedMarket: result.rows[0] };
  }
}