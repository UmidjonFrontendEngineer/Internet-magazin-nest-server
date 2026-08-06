import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Orders"');
    return result.rows;
  }

  async create(createOrderDto: CreateOrderDto) {
    const {
      name,
      product,
      phone,
      address,
      items,
      status = 'NEW',
    } = createOrderDto;

    const result = await this.pool.query(
      'INSERT INTO "Orders" (name, product, phone, address, items, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        name,
        product,
        phone,
        address,
        JSON.stringify(items),
        status,
      ],
    );
    return result.rows[0];
  }
}