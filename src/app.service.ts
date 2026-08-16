import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AppService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

  getHello(): string {
    return 'Hello!';
  }

  async getRole(email: string, marketId: string) {
    const workerQuery = `
      SELECT w.role 
      FROM "Workers" w
      JOIN "Users" u ON w."userId"::uuid = u.id
      WHERE u.email = $1 AND w."marketId" = $2
    `;

    const workerResult = await this.pool.query(workerQuery, [email, marketId]);

    if (workerResult.rows.length > 0) {
      return { role: workerResult.rows[0].role };
    }

    const marketQuery = `
      SELECT id 
      FROM "Markets" 
      WHERE email = $1 AND id = $2
    `;

    const marketResult = await this.pool.query(marketQuery, [email, marketId]);

    if (marketResult.rows.length > 0) {
      return { role: 'owner' };
    }

    throw new NotFoundException('Bu marketda bunday foydalanuvchi topilmadi');
  }
}
