import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manhua } from '../domain/manhua.entity.js';
import { AddManhuaDto } from './add-manhua.dto.js';

@Injectable()
export class AddManhuaService {
  constructor(
    @Inject('ManhuaRepository')
    private readonly manhuaRepository: Repository<Manhua>,
    @Inject('CloudinaryService')
    private readonly cloudinaryService: { uploadImage(data: string): Promise<string> },
  ) {}

  async addManhua(dto: AddManhuaDto): Promise<Manhua> {
    let imageUrl: string | undefined;

    if (dto.image) {
      imageUrl = await this.cloudinaryService.uploadImage(dto.image);
    }

    const manhua = this.manhuaRepository.create({
      titre: dto.titre,
      nombreDeChapitres: dto.nombreDeChapitres ?? 0,
      nombreDeChapitresLus: 0,
      activé: true,
      imageUrl: imageUrl ?? null,
    } as Manhua);

    return this.manhuaRepository.save(manhua) as Promise<Manhua>;
  }
}
