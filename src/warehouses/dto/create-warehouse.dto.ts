import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWarehouseDto {
    @IsNotEmpty({ message: "Ombor nomi bo'lishi shart" })
    @IsString({}, { message: "Ombor nomini kiriting" })
    title!: string;

    @IsNotEmpty({ message: "Email kiritilishi shart" })
    @IsEmail({}, { message: "Yaroqli email manzilini kiriting" })
    email!: string;

    @IsNotEmpty({ message: "Kenglik (lat) kiritilishi shart" })
    @Type(() => Number)
    @IsNumber({}, { message: "Kenglik raqam bo'lishi kerak" })
    lat!: number;

    @IsNotEmpty({ message: "Uzunlik (lng) kiritilishi shart" })
    @Type(() => Number)
    @IsNumber({}, { message: "Uzunlik raqam bo'lishi kerak" })
    lng!: number;


    @IsNotEmpty({ message: "marketId kiritilishi shart" })
    @IsString({}, { message: "MarketId ni kiriting" })
    marketId!: string;
}