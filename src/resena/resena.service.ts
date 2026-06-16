import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResenaEntity } from './entities/resena.entity';
import { Repository, Not } from 'typeorm';
import { CreateResenaDto } from './dto/create-resena.dto';
import { MessageDto } from '../common/message.dto';

@Injectable()
export class ResenaService {
    constructor(
        @InjectRepository(ResenaEntity)
        private resenaRepository: Repository<ResenaEntity>,
    ) {}

    async getById(idLibro: number): Promise<ResenaEntity[]> {
        const resenas = await this.resenaRepository.find({
            where: { libro: { id_libro: idLibro } },
            relations: { usuario: true },
        });

        if (!resenas.length) {
            throw new NotFoundException('Este libro aun no tiene reseñas.');
        }

        return resenas;
    }

    async create(
        createResenaDto: CreateResenaDto,
        idUsuario: number,
    ): Promise<MessageDto> {
        const exists = await this.resenaRepository.findOne({
            where: {
                libro: { id_libro: createResenaDto.libro_id },
                usuario: { id: idUsuario },
            },
        });

        if (exists) {
            throw new ConflictException(
                'Ya hay una reseña para este libro por este usuario.',
            );
        }

        const payload = this.resenaRepository.create({
            rating: createResenaDto.rating,
            libro: { id_libro: createResenaDto.libro_id },
            usuario: { id: idUsuario },
        });

        await this.resenaRepository.save(payload);

        return new MessageDto('Reseña guardada con exito.');
    }

    async calcularAfinidad(usuarioId: number) {
        const misResenas = await this.resenaRepository.find({
            where: { usuario: { id: usuarioId } },
            relations: { libro: true },
        });

        if (!misResenas.length) {
            return [];
        }

        const miMapaDeRatings = new Map(
            misResenas.map((r) => [r.libro.id_libro, r.rating]),
        );

        const resenasDeOtros = await this.resenaRepository.find({
            where: { usuario: { id: Not(usuarioId) } },
            relations: { libro: true, usuario: true },
        });

        const afinidades: {
            titulo: string;
            lector: string;
            suRating: number;
            miRating: number;
        }[] = [];

        for (const rese of resenasDeOtros) {
            const miRating = miMapaDeRatings.get(rese.libro.id_libro);

            if (miRating !== undefined) {
                if (Math.abs(miRating - rese.rating) <= 1) {
                    afinidades.push({
                        titulo: rese.libro.titulo,
                        lector: rese.usuario.nombre,
                        suRating: rese.rating,
                        miRating: miRating,
                    });
                }
            }
        }

        return afinidades;
    }
}
