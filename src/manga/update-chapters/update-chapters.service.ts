import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manga } from '../domain/manga.entity.js';

@Injectable()
export class UpdateChaptersMangaService {
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: Repository<Manga>,
  ) {}

  async addChapters(id: number, value: number): Promise<Manga> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manga = await this.mangaRepository.findOneBy({ id });
    if (!manga) {
      throw new NotFoundException('Manga non trouvé');
    }

    manga.nombreDeChapitres += value;
    return this.mangaRepository.save(manga);
  }

  async addReadChapters(id: number, value: number): Promise<Manga> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manga = await this.mangaRepository.findOneBy({ id });
    if (!manga) {
      throw new NotFoundException('Manga non trouvé');
    }

    if (manga.nombreDeChapitresLus + value > manga.nombreDeChapitres) {
      throw new BadRequestException('Le nombre de chapitres lus ne peut pas dépasser le total');
    }

    manga.nombreDeChapitresLus += value;
    return this.mangaRepository.save(manga);
  }

  async removeChapters(id: number, value: number): Promise<Manga> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manga = await this.mangaRepository.findOneBy({ id });
    if (!manga) {
      throw new NotFoundException('Manga non trouvé');
    }

    if (manga.nombreDeChapitres - value < 0) {
      throw new BadRequestException('Le nombre de chapitres ne peut pas être négatif');
    }

    if (manga.nombreDeChapitresLus > manga.nombreDeChapitres - value) {
      throw new BadRequestException('Le nombre de chapitres lus dépasse le nouveau total');
    }

    manga.nombreDeChapitres -= value;
    return this.mangaRepository.save(manga);
  }

  async removeReadChapters(id: number, value: number): Promise<Manga> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manga = await this.mangaRepository.findOneBy({ id });
    if (!manga) {
      throw new NotFoundException('Manga non trouvé');
    }

    if (manga.nombreDeChapitresLus - value < 0) {
      throw new BadRequestException('Le nombre de chapitres lus ne peut pas être négatif');
    }

    manga.nombreDeChapitresLus -= value;
    return this.mangaRepository.save(manga);
  }
}
