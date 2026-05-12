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
    private readonly cloudinaryService: {
      uploadImage(file: Express.Multer.File): Promise<string>;
    },
  ) {}

  async addManga(
    dto: AddMangaDto,
    image?: Express.Multer.File,
  ): Promise<Manga> {
    let imageUrl: string | null = null;

    if (image) {
      imageUrl = await this.cloudinaryService.uploadImage(image);
    }

    const manga = this.mangaRepository.create({
      titre: dto.titre,
      auteur: dto.auteur,
      nombreDeChapitres: dto.nombreDeChapitres ?? 0,
      nombreDeChapitresLus: 0,
      activé: true,
      imageUrl,
    });

    return this.mangaRepository.save(manga);
  }
}
