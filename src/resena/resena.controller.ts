import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ResenaService } from './resena.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('resena')
export class ResenaController {
    constructor(private readonly resenaService: ResenaService) {}

    @Get('libro/:id')
    get(@Param('id') id: number) {
        return this.resenaService.getById(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    create(@Body() createResenaDto: CreateResenaDto, @Request() req) {
        const usuarioId = req.user.id;
        return this.resenaService.create(createResenaDto, usuarioId);
    }

    @Get('afinidad/me')
    @UseGuards(AuthGuard)
    getAfinidad(@Request() req) {
        const usuarioId = req.user.id;
        return this.resenaService.calcularAfinidad(usuarioId);
    }
}
