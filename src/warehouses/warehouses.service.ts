// import { Injectable, Inject } from '@nestjs/common';
// import { Pool } from 'pg';
// import { JwtService } from '@nestjs/jwt';
// import { CreateWarehouseDto } from './dto/create-warehouse.dto';
// import { validateMarketRole } from '../common/helpers/market-role.helper';

// @Injectable()
// export class WarehousesService {
//     constructor(
//         @Inject('DATABASE_POOL') private pool: Pool,
//         private jwtService: JwtService
//     ) { }

//     async findAll() {
//         const result = await this.pool.query('SELECT * FROM "Warehouses"');
//         return result.rows;
//     }

//     async create(warehouser: CreateWarehouseDto, validation: any) {
//         await validateMarketRole(this.pool, this.jwtService, validation);

//         const { title, lat, lng, marketId } = warehouser;

//         const result = await this.pool.query(
//             'INSERT INTO "Warehouses" (title, "marketId", lat, lng) VALUES ($1, $2, $3, $4) RETURNING *',
//             [title, marketId, lat, lng],
//         );
//         return result.rows[0];
//     }
// }






import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
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
            throw new NotFoundException("Sizda bu do'konda amal bajarish huquqi yo'q!");
        }
    }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Warehouses"');
        return result.rows;
    }

    async create(createWarehouseDto: CreateWarehouseDto, userEmail: string) {
        const { title, lat, lng, marketId } = createWarehouseDto;

        await this.checkMarketAccess(marketId, userEmail);

        const result = await this.pool.query(
            'INSERT INTO "Warehouses" (title, lat, lng, "marketId") VALUES ($1, $2, $3, $4) RETURNING *',
            [title, lat, lng, marketId],
        );

        return result.rows[0];
    }

    async update(id: string, updateWarehouseDto: UpdateWarehouseDto, userEmail: string) {
        const existingWarehouse = await this.pool.query(
            'SELECT * FROM "Warehouses" WHERE id = $1',
            [id],
        );

        if (existingWarehouse.rows.length === 0) {
            throw new NotFoundException("Ombor topilmadi!");
        }

        const warehouse = existingWarehouse.rows[0];

        await this.checkMarketAccess(warehouse.marketId, userEmail);

        const { title, lat, lng, marketId } = updateWarehouseDto;

        const targetMarket = marketId || warehouse.marketId;
        if (marketId && marketId !== warehouse.marketId) {
            await this.checkMarketAccess(targetMarket, userEmail);
        }

        const result = await this.pool.query(
            `UPDATE "Warehouses" 
       SET title = COALESCE($1, title), 
           lat = COALESCE($2, lat), 
           lng = COALESCE($3, lng), 
           "marketId" = COALESCE($4, "marketId") 
       WHERE id = $5 RETURNING *`,
            [title, lat, lng, targetMarket, id],
        );

        return result.rows[0];
    }

    async remove(id: string, userEmail: string) {
        const existingWarehouse = await this.pool.query(
            'SELECT * FROM "Warehouses" WHERE id = $1',
            [id],
        );

        if (existingWarehouse.rows.length === 0) {
            throw new NotFoundException("Ombor topilmadi!");
        }

        const warehouse = existingWarehouse.rows[0];

        await this.checkMarketAccess(warehouse.marketId, userEmail);

        const result = await this.pool.query(
            'DELETE FROM "Warehouses" WHERE id = $1 RETURNING *',
            [id],
        );

        return { message: "Ombor muvaffaqiyatli o'chirildi", deleted: result.rows[0] };
    }
}