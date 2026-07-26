import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateOrderDto } from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Orders"');
    return result.rows;
  }

  async create(createOrderDto: CreateOrderDto) {
    const {
      userId,
      items,
      totalPrice,
      status = 'pending',
      address = '',
      phone = '',
    } = createOrderDto;

    const result = await this.pool.query(
      'INSERT INTO "Orders" ("userId", items, "totalPrice", status, address, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        userId,
        JSON.stringify(items),
        totalPrice,
        status,
        address,
        phone,
      ],
    );
    return result.rows[0];
  }
}