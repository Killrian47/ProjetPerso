import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manhua } from '../domain/manhua.entity.js';

@Injectable()
export class GetAllManhuaService {
  constructor(
    @Inject('ManhuaRepository')
    private readonly manhuaRepository: Repository<Manhua>,
  ) {}

  async getAllManhua(): Promise<Manhua[]> {
    return this.manhuaRepository.find();
  }
}
