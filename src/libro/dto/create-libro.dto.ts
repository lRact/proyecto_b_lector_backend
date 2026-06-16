import { IsArray, IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from '../../decorators/is-not-blank.decorator';
import { Transform } from 'class-transformer';

export class CreateLibroDto {
  @IsString()
  @IsNotBlank()
  titulo: string;

  @IsString()
  @IsNotBlank()
  sinopsis: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((s) => s.trim()) : value,
  )
  @IsArray()
  @IsString({ each: true })
  autores: string[];

  @IsString()
  @IsNotBlank()
  editor: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((s) => s.trim()) : value,
  )
  @IsArray()
  @IsString({ each: true })
  generos: string[];

  @IsString()
  @IsOptional()
  image_url?: string;
}