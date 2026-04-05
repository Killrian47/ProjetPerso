import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manga } from '../domain/manga.entity';
import { AddMangaDto } from './add-manga.dto';

@Injectable()
export class AddMangaService {
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: Repository<Manga>,
    @Inject('CloudinaryService')
    private readonly cloudinaryService: { uploadImage(data: string): Promise<string> },
  ) {}

  async addManga(dto: AddMangaDto): Promise<Manga> {
    let imageUrl: string | undefined;

    if (dto.image) {
      imageUrl = await this.cloudinaryService.uploadImage(dto.image);
    }

    const manga = this.mangaRepository.create({
      titre: dto.titre,
      auteur: dto.auteur,
      nombreDeChapitres: dto.nombreDeChapitres ?? 0,
      nombreDeChapitresLus: 0,
      activé: true,
      imageUrl: imageUrl ?? null,
    });

    return this.mangaRepository.save(manga);
  }
}
