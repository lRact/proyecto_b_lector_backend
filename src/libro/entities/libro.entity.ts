import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'libro' })
export class LibroEntity {
    @PrimaryGeneratedColumn()
    id_libro: number;

    @Column({ type: 'varchar', length: 150, nullable: false })
    titulo: string;

    @Column({ type: 'text', nullable: false })
    sinopsis: string;

    @Column({ type: 'simple-array', nullable: false })
    autores: string[];

    @Column({ type: 'varchar', length: 64, nullable: false })
    editor: string;

    @Column({ type: 'simple-array', nullable: false })
    generos: string[];

    @Column({ type: 'varchar', length: 255, nullable: false })
    image_url: string;
}