import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateFollowingDto {
    @IsNotEmpty({ message: "Foydalanuvchi ID (userId) kiritilishi shart" })
    @IsString({ message: "userId matn shaklida bo'lishi kerak" })
    userId!: string;

    @IsOptional()
    @IsArray({ message: "following ma'lumotlar massiv (array) ko'rinishida bo'lishi kerak" })
    following?: any[];
}