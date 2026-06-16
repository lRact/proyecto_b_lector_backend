import { Module } from '@nestjs/common';
import { LibroService } from './libro.service';
import { LibroController } from './libro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from './entities/libro.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LibroEntity]),],
    controllers: [LibroController],
    providers: [LibroService],
})
export class LibroModule {}
