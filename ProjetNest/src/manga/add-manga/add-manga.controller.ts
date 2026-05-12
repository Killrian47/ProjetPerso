import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddMangaService } from './add-manga.service';
import { AddMangaDto } from './add-manga.dto';
import { Manga } from '../domain/manga.entity';

@Controller()
export class AddMangaController {
  constructor(private readonly addMangaService: AddMangaService) {}

  @Post('/addManga')
  @UseInterceptors(FileInterceptor('image'))
  async addManga(
    @Body() dto: AddMangaDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Manga> {
    return this.addMangaService.addManga(dto, image);
  }
}
