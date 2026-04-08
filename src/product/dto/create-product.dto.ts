import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer'

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price!: number; // centavos

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}