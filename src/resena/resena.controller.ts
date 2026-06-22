import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Request,
    Delete
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

    @Get('usuario/:id')
    getByUserId(@Param('id') id: number) {
        return this.resenaService.getByUserId(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    create(@Body() createResenaDto: CreateResenaDto) {
        return this.resenaService.create(createResenaDto);
    }

    @Get('afinidad/me')
    @UseGuards(AuthGuard)
    getAfinidad(@Request() req) {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return [];
        }

        const token = authHeader.split(' ')[1];
        
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        
        const usuarioId = payload.userId || payload.id; 
        
        return this.resenaService.calcularAfinidad(usuarioId);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.resenaService.delete(id);
    }
}
