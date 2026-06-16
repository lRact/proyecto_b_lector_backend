import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateResenaDto {
    @IsNumber()
    @IsNotEmpty()
    libro_id: number;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
}