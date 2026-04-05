import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manhua } from '../domain/manhua.entity.js';

@Injectable()
export class UpdateChaptersManhuaService {
  constructor(
    @Inject('ManhuaRepository')
    private readonly manhuaRepository: Repository<Manhua>,
  ) {}

  async addChapters(id: number, value: number): Promise<Manhua> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manhua = await this.manhuaRepository.findOneBy({ id });
    if (!manhua) {
      throw new NotFoundException('Manhua non trouvé');
    }

    manhua.nombreDeChapitres += value;
    return this.manhuaRepository.save(manhua);
  }
}
