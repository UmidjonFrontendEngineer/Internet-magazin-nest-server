import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMarketDto {
    @IsNotEmpty({ message: "Email kiritilishi shart" })
    @IsEmail({}, { message: "Yaroqli email manzilini kiriting" })
    email!: string;

    @IsNotEmpty({ message: "Do'kon nomi (title) kiritilishi shart" })
    @IsString({ message: "Sarlavha matn shaklida bo'lishi kerak" })
    title!: string;

    @IsNotEmpty({ message: "Logo kiritilishi shart" })
    @IsString({ message: "Logo matn shaklida bo'lishi kerak" })
    logo!: string;

    @IsNotEmpty({ message: "Kenglik (lat) kiritilishi shart" })
    @Type(() => Number)
    @IsNumber({}, { message: "Kenglik raqam bo'lishi kerak" })
    lat!: number;

    @IsNotEmpty({ message: "Uzunlik (lng) kiritilishi shart" })
    @Type(() => Number)
    @IsNumber({}, { message: "Uzunlik raqam bo'lishi kerak" })
    lng!: number;
}