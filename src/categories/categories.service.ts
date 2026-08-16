import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Categories"');
        return result.rows;
    }

    async create(createDiscountDto, userEmail) {
        console.log(createDiscountDto, userEmail)
    }
}