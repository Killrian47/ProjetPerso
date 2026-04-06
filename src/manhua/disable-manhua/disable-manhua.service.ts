import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manhua } from '../domain/manhua.entity.js';

@Injectable()
export class DisableManhuaService {
  constructor(
    @Inject('ManhuaRepository')
    private readonly manhuaRepository: Repository<Manhua>,
  ) {}

  async disableManhua(id: string): Promise<Manhua> {
    const manhua = await this.manhuaRepository.findOneBy({ id });
    if (!manhua) {
      throw new NotFoundException('Manhua non trouvé');
    }

    manhua.activé = false;
    return this.manhuaRepository.save(manhua);
  }
}
