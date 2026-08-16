import { IsNotEmpty, IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({ message: "Market ID kiritilishi shart" })
    @IsUUID('4', { message: "Market ID yaroqli UUID formatida bo'lishi kerak" })
    marketId!: string;

    @IsNotEmpty({ message: "Kategoriya nomi kiritilishi shart" })
    @IsString({ message: "Kategoriya nomi matn bo'lishi kerak" })
    title!: string;

    @IsOptional()
    @IsArray({ message: "Options massiv ko'rinishida bo'lishi kerak" })
    options?: any[];
}