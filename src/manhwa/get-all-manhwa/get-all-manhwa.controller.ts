import { Controller, Get } from '@nestjs/common';
import { GetAllManhwaService } from './get-all-manhwa.service.js';

@Controller()
export class GetAllManhwaController {
  constructor(private readonly getAllManhwaService: GetAllManhwaService) {}

  @Get('/getAllManhwa')
  async getAllManhwa() {
    return this.getAllManhwaService.getAllManhwa();
  }
}
