import { Controller, Get } from '@nestjs/common';
import { GetAllReadingService } from './get-all-reading.service.js';

@Controller()
export class GetAllReadingController {
  constructor(private readonly getAllReadingService: GetAllReadingService) {}

  @Get('/allReading')
  async getAllReading() {
    return this.getAllReadingService.getAllReading();
  }
}
