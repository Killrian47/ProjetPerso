import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manga } from '../domain/manga.entity.js';

@Injectable()
export class DisableMangaService {
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: Repository<Manga>,
  ) {}

  async disableManga(id: number): Promise<Manga> {
    const manga = await this.mangaRepository.findOneBy({ id });
    if (!manga) {
      throw new NotFoundException('Manga non trouvé');
    }

    manga.activé = false;
    return this.mangaRepository.save(manga);
  }
}
