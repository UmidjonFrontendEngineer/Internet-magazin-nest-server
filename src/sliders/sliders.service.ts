import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';

@Injectable()
export class SlidersService {
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
    const result = await this.pool.query('SELECT * FROM "Sliders"');
    return result.rows;
  }

  async create(createSliderDto: CreateSliderDto, userEmail: string) {
    const { image, link, marketId } = createSliderDto;

    await this.checkMarketAccess(marketId, userEmail);

    const result = await this.pool.query(
      'INSERT INTO "Sliders" (image, link, "marketId") VALUES ($1, $2, $3) RETURNING *',
      [image, link, marketId],
    );

    return result.rows[0];
  }

  async update(id: string, updateSliderDto: UpdateSliderDto, userEmail: string) {
    const existing = await this.pool.query('SELECT * FROM "Sliders" WHERE id = $1', [id]);

    if (existing.rows.length === 0) {
      throw new NotFoundException("Slider topilmadi!");
    }

    const slider = existing.rows[0];
    await this.checkMarketAccess(slider.marketId, userEmail);

    const { image, link, marketId } = updateSliderDto;
    const targetMarket = marketId || slider.marketId;

    if (marketId && marketId !== slider.marketId) {
      await this.checkMarketAccess(targetMarket, userEmail);
    }

    const result = await this.pool.query(
      `UPDATE "Sliders" 
       SET image = COALESCE($1, image), 
           link = COALESCE($2, link), 
           "marketId" = COALESCE($3, "marketId") 
       WHERE id = $4 RETURNING *`,
      [image, link, targetMarket, id],
    );

    return result.rows[0];
  }

  async remove(id: string, userEmail: string) {
    const existing = await this.pool.query('SELECT * FROM "Sliders" WHERE id = $1', [id]);

    if (existing.rows.length === 0) {
      throw new NotFoundException("Slider topilmadi!");
    }

    const slider = existing.rows[0];
    await this.checkMarketAccess(slider.marketId, userEmail);

    const result = await this.pool.query('DELETE FROM "Sliders" WHERE id = $1 RETURNING *', [id]);
    return { message: "Slider muvaffaqiyatli o'chirildi", deleted: result.rows[0] };
  }
}