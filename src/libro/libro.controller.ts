import {
    BadRequestException,
    Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LibroService } from './libro.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('libro')
export class LibroController {
    constructor(private readonly libroService: LibroService) {}

    @Get()
    getAll() {
        return this.libroService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.libroService.getById(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' +Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                callback(null, `book-${ uniqueSuffix }${ ext }`);
            }
        }),
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return callback(new BadRequestException('Solo se permiten los siguientes tipos de imagenes: jpg, jpeg, png'), false);
            }
            callback(null, true);
        }
    }))
    create(@Body() createLibroDto: CreateLibroDto, @UploadedFile() file: Express.Multer.File) {
        if(!file) {
            throw new BadRequestException('Se necesita una foto de portada.');
        }
        return this.libroService.create(createLibroDto, file.filename);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                callback(null, `book-${uniqueSuffix}${ext}`);
            }
        }),
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
              return callback(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png)',), false);
            }
            callback(null, true);
        }
    }))
    update(@Param('id') id: number, @Body() updateLibroDto: UpdateLibroDto, @UploadedFile() file?: Express.Multer.File) {
        return this.libroService.update(id, updateLibroDto, file?.filename);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.libroService.delete(id);
    }
}
