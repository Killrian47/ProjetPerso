import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manga } from '../domain/manga.entity.js';

@Injectable()
export class GetAllMangaService {
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: Repository<Manga>,
  ) {}

  async getAllManga(): Promise<Manga[]> {
    return this.mangaRepository.find();
  }
}
