import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddManhuaService } from './add-manhua.service.js';
import { AddManhuaDto } from './add-manhua.dto.js';
import { Manhua } from '../domain/manhua.entity.js';

@Controller()
export class AddManhuaController {
  constructor(private readonly addManhuaService: AddManhuaService) {}

  @Post('/addManhua')
  @UseInterceptors(FileInterceptor('image'))
  async addManhua(
    @Body() dto: AddManhuaDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Manhua> {
    return this.addManhuaService.addManhua(dto, image);
  }
}
