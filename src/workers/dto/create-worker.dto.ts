import { IsNotEmpty, IsString, IsUUID, IsOpti, isStringonal } from 'class-validator';

export class CreateWorkerDto {
    @IsNotEmpty({ message: "Do'kon ID (marketId) kiritilishi shart" })
    @IsUUID('4', { message: "marketId yaroqli UUID formatida bo'lishi kerak" })
    marketId!: string;

    @IsNotEmpty({ message: "Foydalanuvchi idsi kiritilishi shart" })
    @isString({}, { message: "Yaroqli id manzilini kiriting" })
    userId!: string;

    @IsOptional()
    @IsString({ message: "Rol matn shaklida bo'lishi kerak" })
    role?: string;

    @IsNotEmpty()
    @IsUUID()
    vacancyId!: string;
}