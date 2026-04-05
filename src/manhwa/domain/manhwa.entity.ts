import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Manhwa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  nombreDeChapitres: number;

  @Column({ default: 0 })
  nombreDeChapitresLus: number;

  @Column({ default: true })
  activé: boolean;
}
