import { Injectable, Inject, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { uploadImageToImgBB } from 'src/common/helpers/image-upload.helper';

@Injectable()
export class ProductsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM "Products" ORDER BY "createdAt" DESC');
    return result.rows;
  }

  async createProduct(body: any, files: Array<Express.Multer.File>, user: any) {
    const { title, price, quantity, marketId, warehouseId, descriptionUz, descriptionEn, descriptionRu } = body;

    const marketCheck = await this.pool.query(
      'SELECT * FROM "Markets" WHERE id = $1 AND "userId" = $2',
      [marketId, user.id]
    );

    if (marketCheck.rows.length === 0) {
      throw new ForbiddenException("Siz bu marketga mahsulot qo'shishga haqli emassiz!");
    }

    const imageUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.fieldname.startsWith('image-')) {
          const url = await uploadImageToImgBB({ buffer: file.buffer, originalname: file.originalname });
          imageUrls.push(url);
        }
      }
    }

    const descriptionJson = JSON.stringify({
      uz: descriptionUz || '',
      en: descriptionEn || '',
      ru: descriptionRu || ''
    });

    const finalWarehouseId = warehouseId || 'warehouse-id-32';

    const query = `
      INSERT INTO "Products" 
      (title, description, price, quantity, "marketId", "warehouseId", images, "createdAt")
      VALUES ($1, $2::jsonb, $3, $4, $5, $6, $7::jsonb, NOW())
      RETURNING *;
    `;

    const result = await this.pool.query(query, [
      title,
      descriptionJson,
      Number(price) || 0,
      Number(quantity) || 0,
      marketId,
      finalWarehouseId,
      JSON.stringify(imageUrls)
    ]);

    return result.rows[0];
  }
}