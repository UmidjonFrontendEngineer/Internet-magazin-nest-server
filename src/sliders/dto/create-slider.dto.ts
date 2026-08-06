import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSliderDto {
    @IsNotEmpty({ message: "Rasm manzili (image_url) kiritilishi shart" })
    @IsString({ message: "Rasm manzili matn shaklida bo'lishi kerak" })
    image_url!: string;

    @IsNotEmpty({ message: "Havola (link) kiritilishi shart" })
    @IsString({ message: "Havola matn shaklida bo'lishi kerak" })
    link!: string;

    @IsNotEmpty({ message: "Market kiritilishi shart" })
    @IsString({ message: "Market matn shaklida bo'lishi kerak" })
    market!: string;
}