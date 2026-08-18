import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSliderDto {
    @IsNotEmpty({ message: "Rasm havolasi (imageUrl) bo'sh bo'lmasligi kerak" })
    @IsString({ message: "Rasm havolasi matn shaklida bo'lishi kerak" })
    imageUrl!: string;

    @IsNotEmpty({ message: "Yo'naltirish havolasi (redirectUrl) kiritilishi shart" })
    @IsString({ message: "Yo'naltirish havolasi matn shaklida bo'lishi kerak" })
    redirectUrl!: string;

    @IsNotEmpty({ message: "Market kiritilishi shart" })
    @IsString({ message: "Market matn shaklida bo'lishi kerak" })
    market!: string;
}