import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
    @IsNotEmpty({ message: "Mahsulot ID (productId) kiritilishi shart" })
    @IsUUID('4', { message: "productId yaroqli UUID formatida bo'lishi kerak" })
    productId!: string;

    @IsNotEmpty({ message: "Foydalanuvchi ID (userId) kiritilishi shart" })
    @IsUUID('4', { message: "userId yaroqli UUID formatida bo'lishi kerak" })
    userId!: string;

    @IsNotEmpty({ message: "Izoh matni (text) kiritilishi shart" })
    @IsString({ message: "Izoh matn shaklida bo'lishi kerak" })
    text!: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "Reyting raqam ko'rinishida bo'lishi kerak" })
    @Min(1, { message: "Reyting kamida 1 bo'lishi kerak" })
    @Max(5, { message: "Reyting ko'pi bilan 5 bo'lishi kerak" })
    rating?: number;
}