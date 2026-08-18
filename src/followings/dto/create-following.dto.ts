import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateFollowingDto {
    @IsNotEmpty({ message: "UserId kiritilishi shart" })
    @IsString({ message: "UserId matn shaklida bo'lishi kerak" })
    userId!: string;

    @IsOptional()
    @IsArray({ message: "Following massiv formatida bo'lishi kerak" })
    following?: any[];
}