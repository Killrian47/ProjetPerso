import { Controller, Get } from '@nestjs/common';
import { GetAllManhuaService } from './get-all-manhua.service.js';

@Controller()
export class GetAllManhuaController {
  constructor(private readonly getAllManhuaService: GetAllManhuaService) {}

  @Get('/getAllManhua')
  async getAllManhua() {
    return this.getAllManhuaService.getAllManhua();
  }
}
