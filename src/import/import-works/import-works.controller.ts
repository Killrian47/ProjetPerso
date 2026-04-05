import { Controller, Post } from '@nestjs/common';
import { ImportWorksService } from './import-works.service.js';

@Controller('import')
export class ImportWorksController {
  constructor(private readonly importWorksService: ImportWorksService) {}

  @Post('/manga')
  async importManga() {
    return this.importWorksService.importManga();
  }

  @Post('/manhwa')
  async importManhwa() {
    return this.importWorksService.importManhwa();
  }

  @Post('/manhua')
  async importManhua() {
    return this.importWorksService.importManhua();
  }
}
