import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AddManhwaController } from './add-manhwa.controller.js';
import { AddManhwaService } from './add-manhwa.service.js';
import { AddManhwaDto } from './add-manhwa.dto.js';
import { BadRequestException } from '@nestjs/common';

describe('AddManhwa (US 2)', () => {
  let controller: AddManhwaController;
  let service: AddManhwaService;

  const mockRepository: any = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCloudinaryService: any = {
    uploadImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddManhwaController],
      providers: [
        AddManhwaService,
        { provide: 'ManhwaRepository', useValue: mockRepository },
        { provide: 'CloudinaryService', useValue: mockCloudinaryService },
      ],
    }).compile();

    controller = module.get<AddManhwaController>(AddManhwaController);
    service = module.get<AddManhwaService>(AddManhwaService);

    jest.clearAllMocks();
  });

  // ===== US 2 — Ajouter un manhwa =====
  describe('US 2 — Ajouter un manhwa', () => {
    // ✅ Scénario 1 — Ajout valide
    describe('Scénario 1 — Ajout valide', () => {
      it('devrait retourner 201 et sauvegarder le manhwa', async () => {
        const dto: AddManhwaDto = {
          titre: 'Solo Leveling',
          nombreDeChapitres: 200,
        };

        const savedManhwa = {
          id: 1,
          ...dto,
          nombreDeChapitresLus: 0,
          activé: true,
          imageUrl: null,
        };

        mockRepository.create.mockReturnValue(savedManhwa);
        mockRepository.save.mockResolvedValue(savedManhwa);

        const result = await controller.addManhwa(dto);

        expect(result).toEqual(savedManhwa);
        expect(mockRepository.save).toHaveBeenCalled();
      });
    });

    // ❌ Scénario 2 — Champ manquant (titre)
    describe('Scénario 2 — Champ manquant', () => {
      it('devrait retourner 400 si le titre est manquant', async () => {
        const dto = {
          nombreDeChapitres: 200,
        } as AddManhwaDto;

        mockRepository.save.mockRejectedValue(new BadRequestException());

        await expect(controller.addManhwa(dto)).rejects.toThrow();
      });
    });

    // 🖼️ Scénario 3 — Upload image
    describe('Scénario 3 — Upload image Cloudinary', () => {
      it("devrait stocker l'URL de l'image après upload", async () => {
        const dto: AddManhwaDto = {
          titre: 'Tower of God',
          nombreDeChapitres: 550,
        };

        const file = {
          fieldname: 'image',
          originalname: 'tog.jpg',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('fake-image-bytes'),
          size: 16,
        } as unknown as Express.Multer.File;

        const cloudinaryUrl = 'https://res.cloudinary.com/demo/tower-of-god.jpg';
        mockCloudinaryService.uploadImage.mockResolvedValue(cloudinaryUrl);

        const savedManhwa = {
          id: 2,
          titre: dto.titre,
          nombreDeChapitres: dto.nombreDeChapitres,
          nombreDeChapitresLus: 0,
          activé: true,
          imageUrl: cloudinaryUrl,
        };

        mockRepository.create.mockReturnValue(savedManhwa);
        mockRepository.save.mockResolvedValue(savedManhwa);

        const result = await controller.addManhwa(dto, file);

        expect(result.imageUrl).toBe(cloudinaryUrl);
        expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(file);
      });
    });

    // 🔢 Scénario 4 — Valeur par défaut
    describe('Scénario 4 — Valeur par défaut chapitres_lus', () => {
      it('devrait avoir nombreDeChapitresLus = 0 par défaut', async () => {
        const dto: AddManhwaDto = {
          titre: 'Noblesse',
          nombreDeChapitres: 544,
        };

        const savedManhwa = {
          id: 3,
          ...dto,
          nombreDeChapitresLus: 0,
          activé: true,
          imageUrl: null,
        };

        mockRepository.create.mockReturnValue(savedManhwa);
        mockRepository.save.mockResolvedValue(savedManhwa);

        const result = await controller.addManhwa(dto);

        expect(result.nombreDeChapitresLus).toBe(0);
      });
    });
  });
});
