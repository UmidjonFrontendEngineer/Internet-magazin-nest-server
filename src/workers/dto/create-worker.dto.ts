import { IsNotEmpty, IsString, IsUUID, IsEmail } from 'class-validator';

export class CreateWorkerDto {
    @IsNotEmpty({ message: "Do'kon ID (shopId) kiritilishi shart" })
    @IsUUID('4', { message: "shopId yaroqli UUID formatida bo'lishi kerak" })
    shopId!: string;

    @IsNotEmpty({ message: "Foydalanuvchi emaili kiritilishi shart" })
    @IsEmail({}, { message: "Yaroqli email manzilini kiriting" })
    userEmail!: string;

    @IsNotEmpty({ message: "Rol (role) kiritilishi shart" })
    @IsString({ message: "Rol matn shaklida bo'lishi kerak" })
    role!: string;
}