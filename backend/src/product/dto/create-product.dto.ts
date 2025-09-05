import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El nombre debe ser un texto válido' })
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto válido' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  @IsOptional()
  price?: number;

  @IsString({ message: 'La URL de la imagen debe ser un texto válido' })
  @IsOptional()
  imageUrl?: string;
}
