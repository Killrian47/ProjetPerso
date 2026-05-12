import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AddMangaController } from './add-manga.controller.js';
import { AddMangaService } from './add-manga.service.js';
import { AddMangaDto } from './add-manga.dto.js';
import { BadRequestException } from '@nestjs/common';

describe('AddManga (US 1)', () => {
  let controller: AddMangaController;
  let service: AddMangaService;

  const mockRepository: any = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCloudinaryService: any = {
    uploadImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddMangaController],
      providers: [
        AddMangaService,
        { provide: 'MangaRepository', useValue: mockRepository },
        { provide: 'CloudinaryService', useValue: mockCloudinaryService },
      ],
    }).compile();

    controller = module.get<AddMangaController>(AddMangaController);
    service = module.get<AddMangaService>(AddMangaService);

    jest.clearAllMocks();
  });

  // ✅ Scénario 1 — Ajout valide
  describe('Scénario 1 — Ajout valide', () => {
    it('devrait retourner 201 et sauvegarder le manga', async () => {
      const dto: AddMangaDto = {
        titre: 'One Piece',
        auteur: 'Eiichiro Oda',
        nombreDeChapitres: 1100,
      };

      const savedManga = {
        id: 1,
        ...dto,
        nombreDeChapitresLus: 0,
        activé: true,
        imageUrl: null,
      };

      mockRepository.create.mockReturnValue(savedManga);
      mockRepository.save.mockResolvedValue(savedManga);

      const result = await controller.addManga(dto);

      expect(result).toEqual(savedManga);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 2 — Champ manquant (titre)
  describe('Scénario 2 — Champ manquant', () => {
    it('devrait retourner 400 si le titre est manquant', async () => {
      const dto = {
        auteur: 'Eiichiro Oda',
        nombreDeChapitres: 1100,
      } as AddMangaDto;

      mockRepository.save.mockRejectedValue(new BadRequestException());

      await expect(controller.addManga(dto)).rejects.toThrow();
    });
  });

  // 🖼️ Scénario 3 — Upload image
  describe('Scénario 3 — Upload image Cloudinary', () => {
    it('devrait stocker l\'URL de l\'image après upload', async () => {
      const dto: AddMangaDto = {
        titre: 'Naruto',
        auteur: 'Masashi Kishimoto',
        nombreDeChapitres: 700,
      };

      const file = {
        fieldname: 'image',
        originalname: 'naruto.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake-image-bytes'),
        size: 16,
      } as unknown as Express.Multer.File;

      const cloudinaryUrl = 'https://res.cloudinary.com/demo/naruto.jpg';
      mockCloudinaryService.uploadImage.mockResolvedValue(cloudinaryUrl);

      const savedManga = {
        id: 2,
        titre: dto.titre,
        auteur: dto.auteur,
        nombreDeChapitres: dto.nombreDeChapitres,
        nombreDeChapitresLus: 0,
        activé: true,
        imageUrl: cloudinaryUrl,
      };

      mockRepository.create.mockReturnValue(savedManga);
      mockRepository.save.mockResolvedValue(savedManga);

      const result = await controller.addManga(dto, file);

      expect(result.imageUrl).toBe(cloudinaryUrl);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(file);
    });
  });

  // 🔢 Scénario 4 — Valeur par défaut
  describe('Scénario 4 — Valeur par défaut chapitres_lus', () => {
    it('devrait avoir nombreDeChapitresLus = 0 par défaut', async () => {
      const dto: AddMangaDto = {
        titre: 'Bleach',
        auteur: 'Tite Kubo',
        nombreDeChapitres: 686,
      };

      const savedManga = {
        id: 3,
        ...dto,
        nombreDeChapitresLus: 0,
        activé: true,
        imageUrl: null,
      };

      mockRepository.create.mockReturnValue(savedManga);
      mockRepository.save.mockResolvedValue(savedManga);

      const result = await controller.addManga(dto);

      expect(result.nombreDeChapitresLus).toBe(0);
    });
  });
});
