import { Module } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaEntity } from './entities/resena.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ResenaEntity]),],
    controllers: [ResenaController],
    providers: [ResenaService],
})
export class ResenaModule {}
