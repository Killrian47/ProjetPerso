import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manhwa } from '../domain/manhwa.entity.js';

@Injectable()
export class DisableManhwaService {
  constructor(
    @Inject('ManhwaRepository')
    private readonly manhwaRepository: Repository<Manhwa>,
  ) {}

  async disableManhwa(id: number): Promise<Manhwa> {
    const manhwa = await this.manhwaRepository.findOneBy({ id });
    if (!manhwa) {
      throw new NotFoundException('Manhwa non trouvé');
    }

    manhwa.activé = false;
    return this.manhwaRepository.save(manhwa);
  }
}
