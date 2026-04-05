import { Controller, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { DisableManhwaService } from './disable-manhwa.service.js';

@Controller()
export class DisableManhwaController {
  constructor(private readonly disableManhwaService: DisableManhwaService) {}

  @Patch('/disableManhwa/:id')
  async disableManhwa(@Param('id', ParseIntPipe) id: number) {
    return this.disableManhwaService.disableManhwa(id);
  }
}
