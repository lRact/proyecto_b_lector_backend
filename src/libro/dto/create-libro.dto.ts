import { IsArray, IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from '../../decorators/is-not-blank.decorator';

export class CreateLibroDto {
    @IsString()
    @IsNotBlank()
    titulo: string;

    @IsString()
    @IsNotBlank()
    sinopsis: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotBlank()
    autores: string;

    @IsString()
    @IsNotBlank()
    editor: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotBlank()
    generos: string;

    @IsString()
    @IsOptional()
    image_url: string;
}