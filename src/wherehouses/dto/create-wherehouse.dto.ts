import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWherehouseDto {
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
}