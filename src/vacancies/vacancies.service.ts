import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { uploadImageToImgBB } from 'src/common/helpers/image-upload.helper';

@Injectable()
export class VacanciesService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Vacancies" WHERE status = \'active\'');
        return result.rows;
    }

    async findByShopId(shopId: string) {
        const query = 'SELECT * FROM "Vacancies" WHERE "shopId" = $1';
        const result = await this.pool.query(query, [shopId]);
        return result.rows;
    }

    async create(vacancy: CreateVacancyDto, file: { buffer: Buffer; originalname: string }) {
        if (!file) {
            throw new BadRequestException('Rasm yuklanishi shart!');
        }

        const imageUrl = await uploadImageToImgBB(file);

        const query = `
            INSERT INTO "Vacancies" ("shopId", "title", "description", "image", "requiredWorkers", "requiredRole", "salary")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const values = [
            vacancy.shopId,
            vacancy.title,
            vacancy.description,
            imageUrl,
            Number(vacancy.requiredWorkers),
            vacancy.requiredRole, 
            vacancy.salary ? Number(vacancy.salary) : null
        ];
        
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }
}