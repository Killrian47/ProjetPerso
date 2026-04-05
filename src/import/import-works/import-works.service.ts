import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manga } from '../../manga/domain/manga.entity.js';
import { Manhwa } from '../../manhwa/domain/manhwa.entity.js';
import { Manhua } from '../../manhua/domain/manhua.entity.js';

@Injectable()
export class ImportWorksService {
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: Repository<Manga>,
    @Inject('ManhwaRepository')
    private readonly manhwaRepository: Repository<Manhwa>,
    @Inject('ManhuaRepository')
    private readonly manhuaRepository: Repository<Manhua>,
    @Inject('ScraperService')
    private readonly scraperService: {
      fetchManga(): Promise<{ titre: string; auteur: string }[]>;
      fetchManhwa(): Promise<{ titre: string }[]>;
      fetchManhua(): Promise<{ titre: string }[]>;
    },
  ) {}

  async importManga(): Promise<Manga[]> {
    const mangasFromSource = await this.scraperService.fetchManga();
    const imported: Manga[] = [];

    for (const source of mangasFromSource) {
      const existing = await this.mangaRepository.findOneBy({ titre: source.titre });
      if (!existing) {
        const manga = this.mangaRepository.create({
          titre: source.titre,
          auteur: source.auteur,
          nombreDeChapitres: 0,
          nombreDeChapitresLus: 0,
          activé: true,
        });
        const saved = await this.mangaRepository.save(manga);
        imported.push(saved);
      }
    }

    return imported;
  }

  async importManhwa(): Promise<Manhwa[]> {
    const manhwasFromSource = await this.scraperService.fetchManhwa();
    const imported: Manhwa[] = [];

    for (const source of manhwasFromSource) {
      const existing = await this.manhwaRepository.findOneBy({ titre: source.titre });
      if (!existing) {
        const manhwa = this.manhwaRepository.create({
          titre: source.titre,
          nombreDeChapitres: 0,
          nombreDeChapitresLus: 0,
          activé: true,
        });
        const saved = await this.manhwaRepository.save(manhwa);
        imported.push(saved);
      }
    }

    return imported;
  }

  async importManhua(): Promise<Manhua[]> {
    const manhuasFromSource = await this.scraperService.fetchManhua();
    const imported: Manhua[] = [];

    for (const source of manhuasFromSource) {
      const existing = await this.manhuaRepository.findOneBy({ titre: source.titre });
      if (!existing) {
        const manhua = this.manhuaRepository.create({
          titre: source.titre,
          nombreDeChapitres: 0,
          nombreDeChapitresLus: 0,
          activé: true,
        });
        const saved = await this.manhuaRepository.save(manhua);
        imported.push(saved);
      }
    }

    return imported;
  }
}
