import { Controller, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { UpdateChaptersMangaService } from './update-chapters.service.js';
import { UpdateChaptersDto } from './update-chapters.dto.js';

@Controller()
export class UpdateChaptersMangaController {
  constructor(private readonly updateChaptersService: UpdateChaptersMangaService) {}

  @Patch('/manga/:id/addChapters')
  async addChapters(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChaptersDto,
  ) {
    return this.updateChaptersService.addChapters(id, dto.value);
  }

  @Patch('/manga/:id/addReadChapters')
  async addReadChapters(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChaptersDto,
  ) {
    return this.updateChaptersService.addReadChapters(id, dto.value);
  }

  @Patch('/manga/:id/removeChapters')
  async removeChapters(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChaptersDto,
  ) {
    return this.updateChaptersService.removeChapters(id, dto.value);
  }
}
