import { Controller, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { DisableManhuaService } from './disable-manhua.service.js';

@Controller()
export class DisableManhuaController {
  constructor(private readonly disableManhuaService: DisableManhuaService) {}

  @Patch('/disableManhua/:id')
  async disableManhua(@Param('id', ParseUUIDPipe) id: string) {
    return this.disableManhuaService.disableManhua(id);
  }
}
