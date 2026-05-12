import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddManhwaService } from './add-manhwa.service.js';
import { AddManhwaDto } from './add-manhwa.dto.js';
import { Manhwa } from '../domain/manhwa.entity.js';

@Controller()
export class AddManhwaController {
  constructor(private readonly addManhwaService: AddManhwaService) {}

  @Post('/addManhwa')
  @UseInterceptors(FileInterceptor('image'))
  async addManhwa(
    @Body() dto: AddManhwaDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Manhwa> {
    return this.addManhwaService.addManhwa(dto, image);
  }
}
