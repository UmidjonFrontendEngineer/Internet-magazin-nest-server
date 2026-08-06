import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsNotEmpty({ message: "Mahsulot nomi (title) kiritilishi shart" })
    @IsString({ message: "Sarlavha matn shaklida bo'lishi kerak" })
    title!: string;

    @IsNotEmpty({ message: "Tavsif (description) kiritilishi shart" })
    description!: any;

    @IsNotEmpty({ message: "Narx (price) kiritilishi shart" })
    @Type(() => Number)
    @IsNumber({}, { message: "Narx raqam ko'rinishida bo'lishi kerak" })
    @Min(0, { message: "Narx 0 dan kichik bo'lishi mumkin emas" })
    price!: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "Foiz raqam ko'rinishida bo'lishi kerak" })
    @Min(0, { message: "Foiz 0 dan kichik bo'lishi mumkin emas" })
    @Max(100, { message: "Foiz 100 dan katta bo'lishi mumkin emas" })
    percentage?: number;

    @IsOptional()
    @IsString({ message: "Tab matn shaklida bo'lishi kerak" })
    tab?: string;

    @IsOptional()
    @IsString({ message: "Gradient select matn shaklida bo'lishi kerak" })
    gradientSelect?: string;

    @IsOptional()
    @IsArray({ message: "Gradient massiv (array) ko'rinishida bo'lishi kerak" })
    @IsString({ each: true, message: "Gradient elementlari matn shaklida bo'lishi kerak" })
    gradient?: string[];

    @IsOptional()
    @IsString({ message: "Chegirma select matn shaklida bo'lishi kerak" })
    chegirmaSelect?: string;

    @IsOptional()
    @IsString({ message: "Chegirma matn shaklida bo'lishi kerak" })
    chegirma?: string;

    @IsNotEmpty({ message: "Options kiritilishi shart" })
    options!: any;

    @IsOptional()
    @IsArray({ message: "Rasmlar massiv (array) ko'rinishida bo'lishi kerak" })
    @IsString({ each: true, message: "Rasm havolalari matn shaklida bo'lishi kerak" })
    images?: string[];

    @IsNotEmpty({ message: "Miqdor (quantity) kiritilishi shart" })
    @Type(() => Number)
    @IsNumber({}, { message: "Miqdor raqam ko'rinishida bo'lishi kerak" })
    @Min(0, { message: "Miqdor 0 dan kichik bo'lishi mumkin emas" })
    quantity!: number;

    @IsNotEmpty({ message: "Market kiritilishi shart" })
    @IsString({ message: "Market matn shaklida bo'lishi kerak" })
    market!: string;
}