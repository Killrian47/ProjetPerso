import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateChaptersMangaController } from './update-chapters.controller.js';
import { UpdateChaptersMangaService } from './update-chapters.service.js';
import { BadRequestException } from '@nestjs/common';

describe('UpdateChaptersManga (US 8)', () => {
  let controller: UpdateChaptersMangaController;

  const mockRepository: any = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateChaptersMangaController],
      providers: [
        UpdateChaptersMangaService,
        { provide: 'MangaRepository', useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<UpdateChaptersMangaController>(UpdateChaptersMangaController);

    jest.clearAllMocks();
  });

  // ✅ Scénario 1 — Ajouter +1 chapitre
  describe('Scénario 1 — Ajouter +1 chapitre', () => {
    it('devrait incrémenter le nombre de chapitres', async () => {
      const manga = { id: 1, titre: 'One Piece', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manga });
      mockRepository.save.mockResolvedValue({ ...manga, nombreDeChapitres: 101 });

      const result = await controller.addChapters(1, { value: 1 });

      expect(result.nombreDeChapitres).toBe(101);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 2 — Valeur négative
  describe('Scénario 2 — Valeur négative', () => {
    it('devrait retourner une erreur si la valeur est négative', async () => {
      const manga = { id: 1, titre: 'One Piece', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manga });

      await expect(controller.addChapters(1, { value: -5 })).rejects.toThrow(BadRequestException);
    });
  });
});
