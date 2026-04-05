import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manhwa } from '../domain/manhwa.entity.js';

@Injectable()
export class GetAllManhwaService {
  constructor(
    @Inject('ManhwaRepository')
    private readonly manhwaRepository: Repository<Manhwa>,
  ) {}

  async getAllManhwa(): Promise<Manhwa[]> {
    return this.manhwaRepository.find();
  }
}
