import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

  private async checkMarketAccess(marketId: string, userEmail: string): Promise<void> {
    let isAuthorized = false;

    const marketOwnerCheck = await this.pool.query(
      'SELECT * FROM "Markets" WHERE id = $1 AND email = $2',
      [marketId, userEmail],
    );

    if (marketOwnerCheck.rows.length > 0) {
      isAuthorized = true;
    } else {
      const userQuery = await this.pool.query(
        'SELECT id FROM "Users" WHERE email = $1',
        [userEmail],
      );

      if (userQuery.rows.length > 0) {
        const userId = userQuery.rows[0].id;

        const workerCheck = await this.pool.query(
          'SELECT * FROM "Workers" WHERE "marketId" = $1 AND "userId" = $2',
          [marketId, userId],
        );

        if (workerCheck.rows.length > 0) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      throw new ForbiddenException("Sizda bu do'konda amal bajarish huquqi yo'q!");
    }
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Discounts"');
    return result.rows;
  }

  async create(createDiscountDto: CreateDiscountDto, userEmail: string) {
    const { title, percentage, startDate, endDate, market } = createDiscountDto;

    await this.checkMarketAccess(market, userEmail);

    const finalStartDate = startDate || new Date();
    const finalEndDate = endDate || new Date();

    const result = await this.pool.query(
      'INSERT INTO "Discounts" (title, percentage, "startDate", "endDate", market) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, percentage, finalStartDate, finalEndDate, market],
    );

    return result.rows[0];
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto, userEmail: string) {
    const existingDiscount = await this.pool.query(
      'SELECT * FROM "Discounts" WHERE id = $1',
      [id],
    );

    if (existingDiscount.rows.length === 0) {
      throw new NotFoundException("Chegirma topilmadi!");
    }

    const discount = existingDiscount.rows[0];

    await this.checkMarketAccess(discount.market, userEmail);

    const { title, percentage, startDate, endDate, market } = updateDiscountDto;

    const targetMarket = market || discount.market;
    if (market && market !== discount.market) {
      await this.checkMarketAccess(targetMarket, userEmail);
    }

    const result = await this.pool.query(
      `UPDATE "Discounts" 
       SET title = COALESCE($1, title), 
           percentage = COALESCE($2, percentage), 
           "startDate" = COALESCE($3, "startDate"), 
           "endDate" = COALESCE($4, "endDate"), 
           market = COALESCE($5, market) 
       WHERE id = $6 RETURNING *`,
      [title, percentage, startDate, endDate, targetMarket, id],
    );

    return result.rows[0];
  }

  async remove(id: string, userEmail: string) {
    const existingDiscount = await this.pool.query(
      'SELECT * FROM "Discounts" WHERE id = $1',
      [id],
    );

    if (existingDiscount.rows.length === 0) {
      throw new NotFoundException("Chegirma topilmadi!");
    }

    const discount = existingDiscount.rows[0];

    await this.checkMarketAccess(discount.market, userEmail);

    const result = await this.pool.query(
      'DELETE FROM "Discounts" WHERE id = $1 RETURNING *',
      [id],
    );

    return { message: "Chegirma muvaffaqiyatli o'chirildi", deleted: result.rows[0] };
  }
}