import { Controller, Post, Body } from '@nestjs/common';
import { AddMangaService } from './add-manga.service';
import { AddMangaDto } from './add-manga.dto';
import { Manga } from '../domain/manga.entity';

@Controller()
export class AddMangaController {
  constructor(private readonly addMangaService: AddMangaService) {}

  @Post('/addManga')
  async addManga(@Body() dto: AddMangaDto): Promise<Manga> {
    return this.addMangaService.addManga(dto);
  }
}
