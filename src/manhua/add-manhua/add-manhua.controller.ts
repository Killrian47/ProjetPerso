import { Controller, Post, Body } from '@nestjs/common';
import { AddManhuaService } from './add-manhua.service.js';
import { AddManhuaDto } from './add-manhua.dto.js';
import { Manhua } from '../domain/manhua.entity.js';

@Controller()
export class AddManhuaController {
  constructor(private readonly addManhuaService: AddManhuaService) {}

  @Post('/addManhua')
  async addManhua(@Body() dto: AddManhuaDto): Promise<Manhua> {
    return this.addManhuaService.addManhua(dto);
  }
}
