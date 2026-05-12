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
    private readonly cloudinaryService: {
      uploadImage(file: Express.Multer.File): Promise<string>;
    },
  ) {}

  async addManhwa(
    dto: AddManhwaDto,
    image?: Express.Multer.File,
  ): Promise<Manhwa> {
    let imageUrl: string | null = null;

    if (image) {
      imageUrl = await this.cloudinaryService.uploadImage(image);
    }

    const manhwa = this.manhwaRepository.create({
      titre: dto.titre,
      nombreDeChapitres: dto.nombreDeChapitres ?? 0,
      nombreDeChapitresLus: 0,
      activé: true,
      imageUrl,
    } as Manhwa);

    return this.manhwaRepository.save(manhwa) as Promise<Manhwa>;
  }
}
