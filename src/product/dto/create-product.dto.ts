import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  price!: number; // centavos

  @IsInt()
  @Min(0)
  stock!: number;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}