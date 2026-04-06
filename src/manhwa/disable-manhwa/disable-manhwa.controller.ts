import { Controller, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { DisableManhwaService } from './disable-manhwa.service.js';

@Controller()
export class DisableManhwaController {
  constructor(private readonly disableManhwaService: DisableManhwaService) {}

  @Patch('/disableManhwa/:id')
  async disableManhwa(@Param('id', ParseUUIDPipe) id: string) {
    return this.disableManhwaService.disableManhwa(id);
  }
}
