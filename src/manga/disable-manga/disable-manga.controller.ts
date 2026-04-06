import { Controller, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { DisableMangaService } from './disable-manga.service.js';

@Controller()
export class DisableMangaController {
  constructor(private readonly disableMangaService: DisableMangaService) {}

  @Patch('/disableManga/:id')
  async disableManga(@Param('id', ParseUUIDPipe) id: string) {
    return this.disableMangaService.disableManga(id);
  }
}
