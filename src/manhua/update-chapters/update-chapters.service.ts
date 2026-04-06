import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manhua } from '../domain/manhua.entity.js';

@Injectable()
export class UpdateChaptersManhuaService {
  constructor(
    @Inject('ManhuaRepository')
    private readonly manhuaRepository: Repository<Manhua>,
  ) {}

  async addChapters(id: string, value: number): Promise<Manhua> {
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

  async addReadChapters(id: string, value: number): Promise<Manhua> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manhua = await this.manhuaRepository.findOneBy({ id });
    if (!manhua) {
      throw new NotFoundException('Manhua non trouvé');
    }

    if (manhua.nombreDeChapitresLus + value > manhua.nombreDeChapitres) {
      throw new BadRequestException('Le nombre de chapitres lus ne peut pas dépasser le total');
    }

    manhua.nombreDeChapitresLus += value;
    return this.manhuaRepository.save(manhua);
  }

  async removeChapters(id: string, value: number): Promise<Manhua> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manhua = await this.manhuaRepository.findOneBy({ id });
    if (!manhua) {
      throw new NotFoundException('Manhua non trouvé');
    }

    if (manhua.nombreDeChapitres - value < 0) {
      throw new BadRequestException('Le nombre de chapitres ne peut pas être négatif');
    }

    if (manhua.nombreDeChapitresLus > manhua.nombreDeChapitres - value) {
      throw new BadRequestException('Le nombre de chapitres lus dépasse le nouveau total');
    }

    manhua.nombreDeChapitres -= value;
    return this.manhuaRepository.save(manhua);
  }

  async removeReadChapters(id: string, value: number): Promise<Manhua> {
    if (value < 0) {
      throw new BadRequestException('La valeur ne peut pas être négative');
    }

    const manhua = await this.manhuaRepository.findOneBy({ id });
    if (!manhua) {
      throw new NotFoundException('Manhua non trouvé');
    }

    if (manhua.nombreDeChapitresLus - value < 0) {
      throw new BadRequestException('Le nombre de chapitres lus ne peut pas être négatif');
    }

    manhua.nombreDeChapitresLus -= value;
    return this.manhuaRepository.save(manhua);
  }
}
