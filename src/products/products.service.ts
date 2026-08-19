import { Injectable, Inject, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { uploadImageToImgBB } from 'src/common/helpers/image-upload.helper';
import { v4 as uuidv4 } from 'uuid';

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
      'SELECT * FROM "Markets" WHERE id = $1 AND email = $2',
      [marketId, user.email]
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

    const optionsMap: { [key: string]: { title: string; items: { key: string; value: number }[] } } = {};

    Object.keys(body).forEach(key => {
      if (key.startsWith('title-') && key.split('-').length === 2) {
        const cIndex = key.split('-')[1];
        if (!optionsMap[cIndex]) optionsMap[cIndex] = { title: body[key], items: [] };
        else optionsMap[cIndex].title = body[key];
      }

      if (key.startsWith('title-') && key.split('-').length === 3) {
        const [, cIndex, index] = key.split('-');
        if (!optionsMap[cIndex]) optionsMap[cIndex] = { title: '', items: [] };
        if (!optionsMap[cIndex].items[Number(index)]) {
          optionsMap[cIndex].items[Number(index)] = { key: body[key], value: 0 };
        } else {
          optionsMap[cIndex].items[Number(index)].key = body[key];
        }
      }

      if (key.startsWith('value-') && key.split('-').length === 3) {
        const [, cIndex, index] = key.split('-');
        if (!optionsMap[cIndex]) optionsMap[cIndex] = { title: '', items: [] };
        if (!optionsMap[cIndex].items[Number(index)]) {
          optionsMap[cIndex].items[Number(index)] = { key: '', value: Number(body[key]) };
        } else {
          optionsMap[cIndex].items[Number(index)].value = Number(body[key]);
        }
      }
    });

    const formattedOptions = Object.values(optionsMap)
      .filter(opt => opt.title && opt.title.trim() !== '')
      .map(opt => ({
        id: uuidv4(),
        title: opt.title,
        options: opt.items
          .filter(item => item && item.key && item.key.trim() !== '')
          .map(item => ({
            id: uuidv4(),
            key: item.key,
            value: Number(item.value) || 0
          }))
      }));

    const finalWarehouseId = warehouseId || 'warehouse-id-32';

    // 5. Bazaga saqlash
    const query = `
      INSERT INTO "Products" 
      (title, description, price, quantity, "marketId", "warehouseId", images, options, "createdAt")
      VALUES ($1, $2::jsonb, $3, $4, $5, $6, $7::jsonb, $8::jsonb, NOW())
      RETURNING *;
    `;

    const result = await this.pool.query(query, [
      title,
      descriptionJson,
      Number(price) || 0,
      Number(quantity) || 0,
      marketId,
      finalWarehouseId,
      JSON.stringify(imageUrls),
      JSON.stringify(formattedOptions)
    ]);

    return result.rows[0];
  }
}