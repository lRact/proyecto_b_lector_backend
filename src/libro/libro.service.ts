import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibroEntity } from './entities/libro.entity';
import { Repository } from 'typeorm';
import { CreateLibroDto } from './dto/create-libro.dto';
import { MessageDto } from '../common/message.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class LibroService {
    constructor(
        @InjectRepository(LibroEntity)
        private libroRepository: Repository<LibroEntity>,
    ) {}
    
    async getAll(): Promise<LibroEntity[]> {
        const list = await this.libroRepository.find();
        
        if(!list.length) {
            throw new NotFoundException('No se encontraron libros.');
        }
        
        return list;
    }
    
    async getById(id_libro: number): Promise<LibroEntity> {
        const libro = await this.libroRepository.findOneBy({ id_libro });

        if(!libro) {
            throw new NotFoundException('Libro no encontrado.');
        }

        return libro;
    }

    async create(createLibroDto: CreateLibroDto, filename: string): Promise<MessageDto> {
        const exists = await this.libroRepository.findOneBy({ titulo: createLibroDto.titulo });

        if(exists) {
            this.deleteFile(filename);
            throw new ConflictException('Este titulo ya existe.');
        }

        const baseUrl = process.env.APP_URL || 'http://localhost:8080';
        const imageUrl = `${ baseUrl }/uploads/${ filename }`;
        const payload: LibroEntity = this.libroRepository.create({
            titulo: createLibroDto.titulo,
            sinopsis: createLibroDto.sinopsis,
            autores: createLibroDto.autores,
            editor: createLibroDto.editor,
            generos: createLibroDto.generos,
            image_url: imageUrl,
        })

        await this.libroRepository.save(payload);

        return new MessageDto('Libro creado correctamente.');
    }

    async update(id_libro: number, updateLibroDto: UpdateLibroDto, filename?: string): Promise<MessageDto> {
        const libro = await this.libroRepository.findOneBy({ id_libro });

        if(!libro) {
            if(filename) {
                this.deleteFile(filename);
            }
            throw new NotFoundException('Libro no encontrado.');
        }

        if(updateLibroDto.titulo) {
            const exists = await this.libroRepository.findOneBy({ titulo: updateLibroDto.titulo });

            if(exists && exists.id_libro !== id_libro) {
                if (filename) {
                    this.deleteFile(filename);
                }
                throw new ConflictException('Este titulo ya esta en uso.');
            }
        }

        const baseUrl = process.env.APP_URL || 'http://localhost:8080';

        if(filename) {
            this.deleteOldFile(libro.image_url);
            updateLibroDto.image_url = `${ baseUrl }/uploads/${ filename }`;
        }

        await this.libroRepository.update(id_libro, updateLibroDto);

        return new MessageDto('Libro creado correctamente.');
    }

    async delete(id_libro: number): Promise<MessageDto> {
        const libro = await this.libroRepository.findOneBy({ id_libro });

        if(!libro) {
            throw new NotFoundException('Libro no encontrado.');
        }

        this.deleteOldFile(libro.image_url);

        await this.libroRepository.delete(id_libro);

        return new MessageDto('Libro creado correctamente.');
    }

    private deleteFile(filename: string) {
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename);

        if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    private deleteOldFile(imageUrl: string) {
        try {
            const filename = imageUrl.split('/').pop();

            if(filename) {
                this.deleteFile(filename);
            }
        }
        catch(error) {
            console.error(`No se pudo eliminar la imagen anterior. ${ error.message }`);
        }
    }
}
