import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSliderDto {
    @IsOptional()
    @IsString()
    image?: string;

    @IsNotEmpty({ message: "Havola (link) kiritilishi shart" })
    @IsString({ message: "Havola matn shaklida bo'lishi kerak" })
    link!: string;

    @IsNotEmpty({ message: "MarketId kiritilishi shart" })
    @IsString({ message: "MarketId matn shaklida bo'lishi kerak" })
    marketId!: string;
}