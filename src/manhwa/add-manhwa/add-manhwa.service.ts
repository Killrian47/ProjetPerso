import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manhwa } from '../domain/manhwa.entity.js';
import { AddManhwaDto } from './add-manhwa.dto.js';

@Injectable()
export class AddManhwaService {
  constructor(
    @Inject('ManhwaRepository')
    private readonly manhwaRepository: Repository<Manhwa>,
    @Inject('CloudinaryService')
    private readonly cloudinaryService: { uploadImage(data: string): Promise<string> },
  ) {}

  async addManhwa(dto: AddManhwaDto): Promise<Manhwa> {
    let imageUrl: string | undefined;

    if (dto.image) {
      imageUrl = await this.cloudinaryService.uploadImage(dto.image);
    }

    const manhwa = this.manhwaRepository.create({
      titre: dto.titre,
      nombreDeChapitres: dto.nombreDeChapitres ?? 0,
      nombreDeChapitresLus: 0,
      activé: true,
      imageUrl: imageUrl ?? null,
    });

    return this.manhwaRepository.save(manhwa);
  }
}
