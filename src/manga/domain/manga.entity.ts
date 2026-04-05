import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Manga {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titre!: string;

  @Column()
  auteur!: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl!: string | null;

  @Column({ default: 0 })
  nombreDeChapitres!: number;

  @Column({ default: 0 })
  nombreDeChapitresLus!: number;

  @Column({ default: true })
  activé!: boolean;
}
