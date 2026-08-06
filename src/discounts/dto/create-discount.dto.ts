import { IsNotEmpty, IsString, IsNumber, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiscountDto {
    @IsNotEmpty({ message: "Chegirma sarlavhasi (title) bo'sh bo'lmasligi kerak" })
    @IsString({ message: "Sarlavha matn shaklida bo'lishi kerak" })
    title!: string;

    @IsNotEmpty({ message: "Chegirma foizi (percentage) kiritilishi shart" })
    @Type(() => Number)
    @IsNumber({}, { message: "Foiz raqam ko'rinishida bo'lishi kerak" })
    @Min(0, { message: "Foiz 0 dan kichik bo'lishi mumkin emas" })
    @Max(100, { message: "Foiz 100 dan katta bo'lishi mumkin emas" })
    percentage!: number;

    @IsNotEmpty({ message: "Boshlanish sanasi (startDate) kiritilishi shart" })
    @IsDateString({}, { message: "Boshlanish sanasi to'g'ri formatda (ISO 8601) bo'lishi kerak" })
    startDate!: string;

    @IsNotEmpty({ message: "Tugash sanasi (endDate) kiritilishi shart" })
    @IsDateString({}, { message: "Tugash sanasi to'g'ri formatda (ISO 8601) bo'lishi kerak" })
    endDate!: string;

    @IsNotEmpty({ message: "Market kiritilishi shart" })
    @IsString({ message: "Market matn shaklida bo'lishi kerak" })
    market!: string;
}