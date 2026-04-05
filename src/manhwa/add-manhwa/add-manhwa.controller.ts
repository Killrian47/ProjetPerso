import { Controller, Post, Body } from '@nestjs/common';
import { AddManhwaService } from './add-manhwa.service.js';
import { AddManhwaDto } from './add-manhwa.dto.js';
import { Manhwa } from '../domain/manhwa.entity.js';

@Controller()
export class AddManhwaController {
  constructor(private readonly addManhwaService: AddManhwaService) {}

  @Post('/addManhwa')
  async addManhwa(@Body() dto: AddManhwaDto): Promise<Manhwa> {
    return this.addManhwaService.addManhwa(dto);
  }
}
