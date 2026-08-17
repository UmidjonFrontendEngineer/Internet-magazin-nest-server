import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const query = `SELECT * FROM "Categories" ORDER BY "createdAt" DESC;`;
        const result = await this.pool.query(query);
        return result.rows;
    }

    async create(createDto: CreateCategoryDto) {
        const { title, marketId, options } = createDto;

        const query = `
            INSERT INTO "Categories" ("marketId", title, options, "createdAt")
            VALUES ($1, $2, $3, NOW())
            RETURNING *;
        `;

        const values = [marketId, title, JSON.stringify(options)];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async findOne(id: string) {
        const query = `SELECT * FROM "Categories" WHERE id = $1;`;
        const result = await this.pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundException(`Kategoriya topilmadi`);
        }
        return result.rows[0];
    }

    async update(id: string, updateDto: UpdateCategoryDto) {
        await this.findOne(id);

        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        if (updateDto.title !== undefined) {
            fields.push(`title = $${index++}`);
            values.push(updateDto.title);
        }

        if (updateDto.options !== undefined) {
            fields.push(`options = $${index++}`);
            values.push(JSON.stringify(updateDto.options));
        }

        if (fields.length === 0) {
            return await this.findOne(id);
        }

        values.push(id);
        const query = `
            UPDATE "Categories"
            SET ${fields.join(', ')}
            WHERE id = $${index}
            RETURNING *;
        `;

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async remove(id: string) {
        await this.findOne(id);
        const query = `DELETE FROM "Categories" WHERE id = $1 RETURNING *;`;
        const result = await this.pool.query(query, [id]);
        return result.rows[0];
    }
}