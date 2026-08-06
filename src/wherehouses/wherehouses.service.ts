import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateWherehouseDto } from './dto/create-wherehouse.dto';
import { uploadImageToImgBB } from 'src/common/helpers/image-upload.helper';

@Injectable()
export class WherehousesService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Wherehouses"');
        return result.rows;
    }
}