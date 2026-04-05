import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateChaptersManhwaController } from './update-chapters.controller.js';
import { UpdateChaptersManhwaService } from './update-chapters.service.js';
import { BadRequestException } from '@nestjs/common';

describe('UpdateChaptersManhwa (US 8)', () => {
  let controller: UpdateChaptersManhwaController;

  const mockRepository: any = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateChaptersManhwaController],
      providers: [
        UpdateChaptersManhwaService,
        { provide: 'ManhwaRepository', useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<UpdateChaptersManhwaController>(UpdateChaptersManhwaController);

    jest.clearAllMocks();
  });

  // ✅ Scénario 1 — Ajouter +1 chapitre
  describe('Scénario 1 — Ajouter +1 chapitre', () => {
    it('devrait incrémenter le nombre de chapitres', async () => {
      const manhwa = { id: 1, titre: 'Solo Leveling', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhwa });
      mockRepository.save.mockResolvedValue({ ...manhwa, nombreDeChapitres: 101 });

      const result = await controller.addChapters(1, { value: 1 });

      expect(result.nombreDeChapitres).toBe(101);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 2 — Valeur négative
  describe('Scénario 2 — Valeur négative', () => {
    it('devrait retourner une erreur si la valeur est négative', async () => {
      const manhwa = { id: 1, titre: 'Solo Leveling', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhwa });

      await expect(controller.addChapters(1, { value: -5 })).rejects.toThrow(BadRequestException);
    });
  });
});
