import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CategoriesService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    private async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'categories' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result!.secure_url);
                },
            );
            Readable.from(file.buffer).pipe(uploadStream);
        });
    }

    private async processOptions(optionsInput: any, files: Express.Multer.File[] = []) {
        let options = optionsInput;
        if (typeof options === 'string') {
            try {
                options = JSON.parse(options);
            } catch (e) {
                throw new BadRequestException('Options formati noto‘g‘ri (JSON parse xatoligi)');
            }
        }

        if (!Array.isArray(options)) return [];

        const fileMap = new Map<string, Express.Multer.File>();
        if (files && Array.isArray(files)) {
            for (const file of files) {
                fileMap.set(file.fieldname, file);
            }
        }

        const processedOptions = [];

        for (let optIndex = 0; optIndex < options.length; optIndex++) {
            const opt = options[optIndex];
            const optionId = opt.id || uuidv4();
            const processedItems = [];

            if (Array.isArray(opt.items)) {
                for (let itemIndex = 0; itemIndex < opt.items.length; itemIndex++) {
                    const item = opt.items[itemIndex];
                    const itemId = item.id || uuidv4();
                    let imageUrl = item.image || '';

                    const fileKey = `file_${optIndex}_${itemIndex}`;
                    if (fileMap.has(fileKey)) {
                        const file = fileMap.get(fileKey)!;
                        imageUrl = await this.uploadToCloudinary(file);
                    }

                    processedItems.push({
                        id: itemId,
                        title: item.title,
                        image: imageUrl,
                    });
                }
            }

            processedOptions.push({
                id: optionId,
                title: opt.title,
                items: processedItems,
            });
        }

        return processedOptions;
    }

    async findAll() {
        const query = `SELECT * FROM "Categories" ORDER BY "createdAt" DESC;`;
        const result = await this.pool.query(query);
        return result.rows;
    }

    async create(body: any, files: Express.Multer.File[]) {
        const { title, marketId } = body;
        if (!title || !marketId) {
            throw new BadRequestException('Title va marketId kiritilishi shart');
        }

        const options = await this.processOptions(body.options, files);

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

    async update(id: string, body: any, files: Express.Multer.File[]) {
        const existingCat = await this.findOne(id);

        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        if (body.title !== undefined) {
            fields.push(`title = $${index++}`);
            values.push(body.title);
        }

        if (body.options !== undefined || (files && files.length > 0)) {
            const rawOptions = body.options !== undefined ? body.options : existingCat.options;
            const options = await this.processOptions(rawOptions, files);
            fields.push(`options = $${index++}`);
            values.push(JSON.stringify(options));
        }

        if (fields.length === 0) {
            return existingCat;
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