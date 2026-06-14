import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsNotBlank } from '../../decorators/is-not-blank.decorator';

export class CreateUsuarioDto {
    @IsString()
    @IsNotBlank()
    nombre: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotBlank()
    @MinLength(8)
    password: string;

    @IsString()
    @IsNotBlank()
    rol: string;
}