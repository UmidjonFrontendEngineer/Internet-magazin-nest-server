import { IsNotEmpty, IsString, IsUUID, IsEmail } from 'class-validator';

export class CreateWorkerDto {
    @IsNotEmpty({ message: "Do'kon ID (marketId) kiritilishi shart" })
    @IsUUID('4', { message: "marketId yaroqli UUID formatida bo'lishi kerak" })
    marketId!: string;

    @IsNotEmpty({ message: "Foydalanuvchi emaili kiritilishi shart" })
    @IsEmail({}, { message: "Yaroqli email manzilini kiriting" })
    userEmail!: string;

    @IsNotEmpty({ message: "Rol (role) kiritilishi shart" })
    @IsString({ message: "Rol matn shaklida bo'lishi kerak" })
    role!: string;
}