import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsuarioEntity } from '../../auth/entities/usuario.entity';
import { LibroEntity } from '../../libro/entities/libro.entity';

@Entity({ name: 'resena' })
export class ResenaEntity {
    @PrimaryGeneratedColumn()
    id_resena: number;
    
    @Column({ type: 'int', nullable: false })
    rating: number;
    
    @ManyToOne(() => UsuarioEntity, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario: UsuarioEntity;

    @ManyToOne(() => LibroEntity, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'libro_id' })
    libro: LibroEntity;
}