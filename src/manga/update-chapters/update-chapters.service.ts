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
}
