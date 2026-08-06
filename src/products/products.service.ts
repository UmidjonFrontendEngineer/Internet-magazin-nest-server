import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateProductDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Products"');
    return result.rows;
  }

  async create(createProductDto: CreateProductDto) {
    const {
      title,
      description,
      price,
      percentage = 0,
      tab = 'auto',
      gradientSelect = 'none',
      gradient = [],
      chegirmaSelect = 'none',
      chegirma = 'none',
      options,
      images = [],
      quantity = 0,
      market,
    } = createProductDto;

    const result = await this.pool.query(
      `INSERT INTO "Products"
      (title, description, price, percentage, tab, "gradientSelect", gradient, "chegirmaSelect", chegirma, options, images, quantity, market)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        title,
        JSON.stringify(description),
        price,
        percentage,
        tab,
        gradientSelect,
        gradient,
        chegirmaSelect,
        chegirma,
        JSON.stringify(options),
        images,
        quantity,
        market,
      ],
    );
    return result.rows[0];
  }
}