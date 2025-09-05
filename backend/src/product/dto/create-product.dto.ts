import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString({ message: 'El nombre debe ser un texto válido' })
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto válido' })
  @IsOptional()
  description?: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @IsNumber({}, { message: 'El precio debe ser un número válido, no un texto' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  @IsOptional()
  price?: number;

  @IsString({ message: 'La URL de la imagen debe ser un texto válido' })
  @IsOptional()
  imageUrl?: string;
}
