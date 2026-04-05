import { Controller, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { UpdateChaptersManhuaService } from './update-chapters.service.js';
import { UpdateChaptersDto } from './update-chapters.dto.js';

@Controller()
export class UpdateChaptersManhuaController {
  constructor(private readonly updateChaptersService: UpdateChaptersManhuaService) {}

  @Patch('/manhua/:id/addChapters')
  async addChapters(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChaptersDto,
  ) {
    return this.updateChaptersService.addChapters(id, dto.value);
  }

  @Patch('/manhua/:id/addReadChapters')
  async addReadChapters(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChaptersDto,
  ) {
    return this.updateChaptersService.addReadChapters(id, dto.value);
  }
}
