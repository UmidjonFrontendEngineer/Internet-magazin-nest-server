import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class SubItemDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    image!: string;
}

class CategoryOptionDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubItemDto)
    items!: SubItemDto[];
}

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    marketId!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategoryOptionDto)
    options!: CategoryOptionDto[];
}

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategoryOptionDto)
    @IsOptional()
    options?: CategoryOptionDto[];
}