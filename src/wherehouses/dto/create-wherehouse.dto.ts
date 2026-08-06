import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWherehouseDto {
    @IsNotEmpty({ message: "Do'kon ID (marketId) kiritilishi shart" })
    @IsUUID('4', { message: "marketId yaroqli UUID formatida bo'lishi kerak" })
    marketId!: string;

    @IsNotEmpty({ message: "Vakansiya sarlavhasi bo'sh bo'lmasligi kerak" })
    @IsString({ message: "Sarlavha matn shaklida bo'lishi kerak" })
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty({ message: "Rasm kiritilishi shart" })
    @IsString({ message: "Rasm matn shaklida bo'lishi kerak" })
    image!: string;

    @IsNotEmpty({ message: "Ishchilar soni kiritilishi shart" })
    @Type(() => Number)
    @IsNumber({}, { message: "Ishchilar soni raqam bo'lishi kerak" })
    @Min(1, { message: "Kamida 1 ta ishchi kerak bo'lishi shart" })
    requiredWorkers!: number;

    @IsNotEmpty({ message: "Talab qilingan rol (requiredRole) kiritilishi shart" })
    @IsString()
    requiredRole!: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "Maosh son ko'rinishida bo'lishi kerak" })
    @Min(0, { message: "Maosh 0 dan kichik bo'lishi mumkin emas" })
    salary?: number;
}