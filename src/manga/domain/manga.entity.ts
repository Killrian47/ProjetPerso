import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Manga {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column()
  declare titre: string;

  @Column()
  declare auteur: string;

  @Column({ nullable: true })
  declare imageUrl: string | null;

  @Column({ default: 0 })
  declare nombreDeChapitres: number;

  @Column({ default: 0 })
  declare nombreDeChapitresLus: number;

  @Column({ default: true })
  declare activé: boolean;
}
