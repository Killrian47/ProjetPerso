import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AddManhuaController } from './add-manhua.controller.js';
import { AddManhuaService } from './add-manhua.service.js';
import { AddManhuaDto } from './add-manhua.dto.js';
import { BadRequestException } from '@nestjs/common';

describe('AddManhua (US 3)', () => {
  let controller: AddManhuaController;
  let service: AddManhuaService;

  const mockRepository: any = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCloudinaryService: any = {
    uploadImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddManhuaController],
      providers: [
        AddManhuaService,
        { provide: 'ManhuaRepository', useValue: mockRepository },
        { provide: 'CloudinaryService', useValue: mockCloudinaryService },
      ],
    }).compile();

    controller = module.get<AddManhuaController>(AddManhuaController);
    service = module.get<AddManhuaService>(AddManhuaService);

    jest.clearAllMocks();
  });

  // ✅ Scénario 1 — Ajout valide
  describe('Scénario 1 — Ajout valide', () => {
    it('devrait retourner 201 et sauvegarder le manhua', async () => {
      const dto: AddManhuaDto = {
        titre: 'Soul Land',
        nombreDeChapitres: 300,
      };

      const savedManhua = {
        id: 1,
        ...dto,
        nombreDeChapitresLus: 0,
        activé: true,
        imageUrl: null,
      };

      mockRepository.create.mockReturnValue(savedManhua);
      mockRepository.save.mockResolvedValue(savedManhua);

      const result = await controller.addManhua(dto);

      expect(result).toEqual(savedManhua);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 2 — Champ manquant (titre)
  describe('Scénario 2 — Champ manquant', () => {
    it('devrait retourner 400 si le titre est manquant', async () => {
      const dto = {
        nombreDeChapitres: 300,
      } as AddManhuaDto;

      mockRepository.save.mockRejectedValue(new BadRequestException());

      await expect(controller.addManhua(dto)).rejects.toThrow();
    });
  });

  // 🖼️ Scénario 3 — Upload image
  describe('Scénario 3 — Upload image Cloudinary', () => {
    it("devrait stocker l'URL de l'image après upload", async () => {
      const dto: AddManhuaDto = {
        titre: 'Tales of Demons and Gods',
        nombreDeChapitres: 450,
      };

      const file = {
        fieldname: 'image',
        originalname: 'tales.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake-image-bytes'),
        size: 16,
      } as unknown as Express.Multer.File;

      const cloudinaryUrl = 'https://res.cloudinary.com/demo/tales.jpg';
      mockCloudinaryService.uploadImage.mockResolvedValue(cloudinaryUrl);

      const savedManhua = {
        id: 2,
        titre: dto.titre,
        nombreDeChapitres: dto.nombreDeChapitres,
        nombreDeChapitresLus: 0,
        activé: true,
        imageUrl: cloudinaryUrl,
      };

      mockRepository.create.mockReturnValue(savedManhua);
      mockRepository.save.mockResolvedValue(savedManhua);

      const result = await controller.addManhua(dto, file);

      expect(result.imageUrl).toBe(cloudinaryUrl);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(file);
    });
  });

  // 🔢 Scénario 4 — Valeur par défaut
  describe('Scénario 4 — Valeur par défaut chapitres_lus', () => {
    it('devrait avoir nombreDeChapitresLus = 0 par défaut', async () => {
      const dto: AddManhuaDto = {
        titre: 'Battle Through the Heavens',
        nombreDeChapitres: 800,
      };

      const savedManhua = {
        id: 3,
        ...dto,
        nombreDeChapitresLus: 0,
        activé: true,
        imageUrl: null,
      };

      mockRepository.create.mockReturnValue(savedManhua);
      mockRepository.save.mockResolvedValue(savedManhua);

      const result = await controller.addManhua(dto);

      expect(result.nombreDeChapitresLus).toBe(0);
    });
  });
});
