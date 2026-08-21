import { Injectable, Inject, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { uploadImageToImgBB } from '../common/helpers/image-upload.helper';

@Injectable()
export class VacanciesService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const result = await this.pool.query('SELECT * FROM "Vacancies"');
        return result.rows;
    }

    async findByMarketId(marketId: string) {
        const query = 'SELECT * FROM "Vacancies" WHERE "marketId" = $1';
        const result = await this.pool.query(query, [marketId]);
        return result.rows;
    }

    async create(vacancy: CreateVacancyDto, file: { buffer: Buffer; originalname: string }) {
        if (!file) {
            throw new BadRequestException('Rasm yuklanishi shart!');
        }

        const imageUrl = await uploadImageToImgBB(file);

        const query = `
            INSERT INTO "Vacancies" ("marketId", "title", "requiredRole", "jobType", "requiredWorkers", "salary", "image", "skills", "experience", "description", "benefits", "hrName", "hrPhone", "hrLink")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;
        `;

        const values = [
            vacancy.marketId,
            vacancy.title,
            vacancy.requiredRole,
            vacancy.jobType,
            Number(vacancy.requiredWorkers),
            vacancy.salary ? Number(vacancy.salary) : null,
            imageUrl,
            vacancy.skills,
            vacancy.experience,
            vacancy.description,
            vacancy.benefits,
            vacancy.hrName,
            vacancy.hrPhone,
            vacancy.hrLink,
        ];

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async applyToVacancy(
        vacancyId: string,
        userEmail: string,
        file?: { buffer: Buffer; originalname: string },
        message?: string
    ) {
        const vacancyCheck = await this.pool.query(
            'SELECT * FROM "Vacancies" WHERE id = $1',
            [vacancyId],
        );

        if (vacancyCheck.rows.length === 0) {
            throw new NotFoundException('Vakansiya topilmadi!');
        }

        const vacancy = vacancyCheck.rows[0];
        const currentApplicants = vacancy.applicants || [];

        const alreadyApplied = currentApplicants.some((app: any) => app.email === userEmail);
        if (alreadyApplied) {
            throw new BadRequestException('Siz allaqachon bu vakansiyaga ariza topshirgansiz!');
        }

        let imageUrl: string | null = null;
        if (file) {
            imageUrl = await uploadImageToImgBB(file);
        }

        const newApplicant = {
            email: userEmail,
            message: message || '',
            image: imageUrl,
            rate: null
        };

        const result = await this.pool.query(
            `UPDATE "Vacancies" 
             SET applicants = applicants || $2::jsonb 
             WHERE id = $1 
             RETURNING *;`,
            [vacancyId, JSON.stringify(newApplicant)],
        );

        return {
            message: "Ariza muvaffaqiyatli yuborildi!",
            vacancy: result.rows[0]
        };
    }

    async remove(vacancyId: string, userEmail: string) {
        const marketQuery = await this.pool.query(
            'SELECT id FROM "Markets" WHERE email = $1',
            [userEmail],
        );

        if (marketQuery.rows.length === 0) {
            throw new NotFoundException('Bu emailga tegishli do‘kon topilmadi!');
        }

        const currentMarketId = marketQuery.rows[0].id;

        const vacancyQuery = await this.pool.query(
            'SELECT * FROM "Vacancies" WHERE id = $1',
            [vacancyId],
        );

        if (vacancyQuery.rows.length === 0) {
            throw new NotFoundException('Vakansiya topilmadi!');
        }

        const vacancy = vacancyQuery.rows[0];

        if (vacancy.marketId !== currentMarketId) {
            throw new ForbiddenException('Sizda bu vakansiyani o‘chirishga huquq yo‘q!');
        }

        const result = await this.pool.query(
            'DELETE FROM "Vacancies" WHERE id = $1 RETURNING *',
            [vacancyId],
        );

        return { message: "Vakansiya muvaffaqiyatli o'chirildi", deletedVacancy: result.rows[0] };
    }

    async rateToVacancy(vacancyId: string, targetEmail: string, rate: number) {
        const vacancyCheck = await this.pool.query(
            'SELECT * FROM "Vacancies" WHERE id = $1',
            [vacancyId],
        );

        if (vacancyCheck.rows.length === 0) {
            throw new NotFoundException('Vakansiya topilmadi!');
        }

        const vacancy = vacancyCheck.rows[0];
        const currentApplicants = vacancy.applicants || [];

        const applicantExists = currentApplicants.some((app: any) => app.email === targetEmail);

        if (!applicantExists) {
            throw new BadRequestException('Bu nomzod ushbu vakansiyaga ariza topshirmagan!');
        }

        const query = `
            UPDATE "Vacancies"
            SET applicants = (
                SELECT jsonb_agg(
                    CASE 
                        WHEN elem->>'email' = $2 THEN jsonb_set(elem, '{rate}', to_jsonb($3::int))
                        ELSE elem
                    END
                )
                FROM jsonb_array_elements(applicants) AS elem
            )
            WHERE id = $1
            RETURNING *;
        `;

        const result = await this.pool.query(query, [vacancyId, targetEmail, rate]);

        return {
            ok: true,
            message: "Nomzod baholandi!",
            vacancy: result.rows[0]
        };
    }
}