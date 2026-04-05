import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manga } from '../../manga/domain/manga.entity.js';
import { Manhwa } from '../../manhwa/domain/manhwa.entity.js';
import { Manhua } from '../../manhua/domain/manhua.entity.js';

@Injectable()
export class GetAllReadingService {
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: Repository<Manga>,
    @Inject('ManhwaRepository')
    private readonly manhwaRepository: Repository<Manhwa>,
    @Inject('ManhuaRepository')
    private readonly manhuaRepository: Repository<Manhua>,
  ) {}

  async getAllReading(): Promise<(Manga | Manhwa | Manhua)[]> {
    const [mangas, manhwas, manhuas] = await Promise.all([
      this.mangaRepository.find({ where: { activé: true } }),
      this.manhwaRepository.find({ where: { activé: true } }),
      this.manhuaRepository.find({ where: { activé: true } }),
    ]);

    return [...mangas, ...manhwas, ...manhuas];
  }
}
