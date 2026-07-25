import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  public pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: "postgresql://neondb_owner:npg_4WDoyZbGeN6P@ep-orange-breeze-atl49sin-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }
}