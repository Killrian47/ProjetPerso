import { Controller, Get } from '@nestjs/common';
import { GetAllMangaService } from './get-all-manga.service.js';

@Controller()
export class GetAllMangaController {
  constructor(private readonly getAllMangaService: GetAllMangaService) {}

  @Get('/getAllManga')
  async getAllManga() {
    return this.getAllMangaService.getAllManga();
  }
}
