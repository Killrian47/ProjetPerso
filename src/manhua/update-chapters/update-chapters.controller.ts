import { Controller, Patch, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { UpdateChaptersManhuaService } from './update-chapters.service.js';
import { UpdateChaptersDto } from './update-chapters.dto.js';

@Controller()
export class UpdateChaptersManhuaController {
  constructor(private readonly updateChaptersService: UpdateChaptersManhuaService) {}

  @Patch('/manhua/:id/addChapters')
  async addChapters(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChaptersDto,
  ) {
    return this.updateChaptersService.addChapters(id, dto.value);
  }

  @Patch('/manhua/:id/addReadChapters')
  async addReadChapters(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChaptersDto,
  ) {
    return this.updateChaptersService.addReadChapters(id, dto.value);
  }

  @Patch('/manhua/:id/removeChapters')
  async removeChapters(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChaptersDto,
  ) {
    return this.updateChaptersService.removeChapters(id, dto.value);
  }

  @Patch('/manhua/:id/removeReadChapters')
  async removeReadChapters(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChaptersDto,
  ) {
    return this.updateChaptersService.removeReadChapters(id, dto.value);
  }
}
