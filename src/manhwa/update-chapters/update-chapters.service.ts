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

  async removeChapters(id: number, value: number): Promise<Manhwa> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manhwa = await this.manhwaRepository.findOneBy({ id });
    if (!manhwa) {
      throw new NotFoundException('Manhwa non trouvé');
    }

    if (manhwa.nombreDeChapitres - value < 0) {
      throw new BadRequestException('Le nombre de chapitres ne peut pas être négatif');
    }

    if (manhwa.nombreDeChapitresLus > manhwa.nombreDeChapitres - value) {
      throw new BadRequestException('Le nombre de chapitres lus dépasse le nouveau total');
    }

    manhwa.nombreDeChapitres -= value;
    return this.manhwaRepository.save(manhwa);
  }

  async removeReadChapters(id: number, value: number): Promise<Manhwa> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manhwa = await this.manhwaRepository.findOneBy({ id });
    if (!manhwa) {
      throw new NotFoundException('Manhwa non trouvé');
    }

    if (manhwa.nombreDeChapitresLus - value < 0) {
      throw new BadRequestException('Le nombre de chapitres lus ne peut pas être négatif');
    }

    manhwa.nombreDeChapitresLus -= value;
    return this.manhwaRepository.save(manhwa);
  }
}
