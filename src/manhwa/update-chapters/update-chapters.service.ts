import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manhwa } from '../domain/manhwa.entity.js';

@Injectable()
export class UpdateChaptersManhwaService {
  constructor(
    @Inject('ManhwaRepository')
    private readonly manhwaRepository: Repository<Manhwa>,
  ) {}

  async addChapters(id: number, value: number): Promise<Manhwa> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manhwa = await this.manhwaRepository.findOneBy({ id });
    if (!manhwa) {
      throw new NotFoundException('Manhwa non trouvé');
    }

    manhwa.nombreDeChapitres += value;
    return this.manhwaRepository.save(manhwa);
  }

  async addReadChapters(id: number, value: number): Promise<Manhwa> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manhwa = await this.manhwaRepository.findOneBy({ id });
    if (!manhwa) {
      throw new NotFoundException('Manhwa non trouvé');
    }

    if (manhwa.nombreDeChapitresLus + value > manhwa.nombreDeChapitres) {
      throw new BadRequestException('Le nombre de chapitres lus ne peut pas dépasser le total');
    }

    manhwa.nombreDeChapitresLus += value;
    return this.manhwaRepository.save(manhwa);
  }
}
