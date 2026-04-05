import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateChaptersManhuaController } from './update-chapters.controller.js';
import { UpdateChaptersManhuaService } from './update-chapters.service.js';
import { BadRequestException } from '@nestjs/common';

describe('UpdateChaptersManhua (US 8)', () => {
  let controller: UpdateChaptersManhuaController;

  const mockRepository: any = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateChaptersManhuaController],
      providers: [
        UpdateChaptersManhuaService,
        { provide: 'ManhuaRepository', useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<UpdateChaptersManhuaController>(UpdateChaptersManhuaController);

    jest.clearAllMocks();
  });

  // ✅ Scénario 1 — Ajouter +1 chapitre
  describe('Scénario 1 — Ajouter +1 chapitre', () => {
    it('devrait incrémenter le nombre de chapitres', async () => {
      const manhua = { id: 1, titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, nombreDeChapitres: 101 });

      const result = await controller.addChapters(1, { value: 1 });

      expect(result.nombreDeChapitres).toBe(101);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 2 — Valeur négative
  describe('Scénario 2 — Valeur négative', () => {
    it('devrait retourner une erreur si la valeur est négative', async () => {
      const manhua = { id: 1, titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });

      await expect(controller.addChapters(1, { value: -5 })).rejects.toThrow(BadRequestException);
    });
  });

  // ===== US 9 — Ajouter chapitre lu =====

  // ✅ Scénario 3 — Ajouter un chapitre lu
  describe('US 9 — Ajouter un chapitre lu', () => {
    it('devrait incrémenter le nombre de chapitres lus', async () => {
      const manhua = { id: 1, titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, nombreDeChapitresLus: 51 });

      const result = await controller.addReadChapters(1, { value: 1 });

      expect(result.nombreDeChapitresLus).toBe(51);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 4 — chapitres_lus > total interdit
  describe('US 9 — chapitres_lus > total interdit', () => {
    it('devrait retourner une erreur si chapitres_lus dépasse le total', async () => {
      const manhua = { id: 1, titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 99, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });

      await expect(controller.addReadChapters(1, { value: 5 })).rejects.toThrow(BadRequestException);
    });
  });
});
