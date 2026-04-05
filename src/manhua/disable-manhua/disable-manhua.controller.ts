import { Controller, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { DisableManhuaService } from './disable-manhua.service.js';

@Controller()
export class DisableManhuaController {
  constructor(private readonly disableManhuaService: DisableManhuaService) {}

  @Patch('/disableManhua/:id')
  async disableManhua(@Param('id', ParseIntPipe) id: number) {
    return this.disableManhuaService.disableManhua(id);
  }
}
