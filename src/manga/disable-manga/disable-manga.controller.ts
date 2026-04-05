import { Controller, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { DisableMangaService } from './disable-manga.service.js';

@Controller()
export class DisableMangaController {
  constructor(private readonly disableMangaService: DisableMangaService) {}

  @Patch('/disableManga/:id')
  async disableManga(@Param('id', ParseIntPipe) id: number) {
    return this.disableMangaService.disableManga(id);
  }
}
