import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { DisableMangaController } from './disable-manga.controller.js';
import { DisableMangaService } from './disable-manga.service.js';
import { NotFoundException } from '@nestjs/common';

describe('DisableManga (US 12)', () => {
  let controller: DisableMangaController;

  const mockRepository: any = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisableMangaController],
      providers: [
        DisableMangaService,
        { provide: 'MangaRepository', useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<DisableMangaController>(DisableMangaController);

    jest.clearAllMocks();
  });

  // ✅ Scénario 1 — Désactiver un manga actif
  describe('Scénario 1 — Désactiver un manga actif', () => {
    it('devrait passer activé à false', async () => {
      const manga = { id: '550e8400-e29b-41d4-a716-446655440000', titre: 'One Piece', activé: true, nombreDeChapitres: 100, nombreDeChapitresLus: 50, imageUrl: null, auteur: 'Oda' };

      mockRepository.findOneBy.mockResolvedValue({ ...manga });
      mockRepository.save.mockResolvedValue({ ...manga, activé: false });

      const result = await controller.disableManga('550e8400-e29b-41d4-a716-446655440000');

      expect(result.activé).toBe(false);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 2 — Manga inexistant
  describe('Scénario 2 — Manga inexistant', () => {
    it('devrait retourner une erreur si le manga n\'existe pas', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(controller.disableManga('00000000-0000-0000-0000-000000000000')).rejects.toThrow(NotFoundException);
    });
  });
});
