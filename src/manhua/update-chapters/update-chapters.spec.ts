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
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, nombreDeChapitres: 101 });

      const result = await controller.addChapters('550e8400-e29b-41d4-a716-446655440002', { value: 1 });

      expect(result.nombreDeChapitres).toBe(101);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 2 — Valeur négative
  describe('Scénario 2 — Valeur négative', () => {
    it('devrait retourner une erreur si la valeur est négative', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });

      await expect(controller.addChapters('550e8400-e29b-41d4-a716-446655440002', { value: -5 })).rejects.toThrow(BadRequestException);
    });
  });

  // ===== US 9 — Ajouter chapitre lu =====

  // ✅ Scénario 3 — Ajouter un chapitre lu
  describe('US 9 — Ajouter un chapitre lu', () => {
    it('devrait incrémenter le nombre de chapitres lus', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, nombreDeChapitresLus: 51 });

      const result = await controller.addReadChapters('550e8400-e29b-41d4-a716-446655440002', { value: 1 });

      expect(result.nombreDeChapitresLus).toBe(51);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 4 — chapitres_lus > total interdit
  describe('US 9 — chapitres_lus > total interdit', () => {
    it('devrait retourner une erreur si chapitres_lus dépasse le total', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 99, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });

      await expect(controller.addReadChapters('550e8400-e29b-41d4-a716-446655440002', { value: 5 })).rejects.toThrow(BadRequestException);
    });
  });

  // ===== US 10 — Supprimer chapitres =====

  // ✅ Scénario 1 — Suppression simple
  describe('US 10 — Suppression simple', () => {
    it('devrait décrémenter de 1 le nombre de chapitres', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, nombreDeChapitres: 99 });

      const result = await controller.removeChapters('550e8400-e29b-41d4-a716-446655440002', { value: 1 });

      expect(result.nombreDeChapitres).toBe(99);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ✅ Scénario 2 — Suppression multiple
  describe('US 10 — Suppression multiple', () => {
    it('devrait décrémenter de 10 le nombre de chapitres', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, nombreDeChapitres: 90 });

      const result = await controller.removeChapters('550e8400-e29b-41d4-a716-446655440002', { value: 10 });

      expect(result.nombreDeChapitres).toBe(90);
    });
  });

  // ❌ Scénario 3 — Suppression dépassant 0
  describe('US 10 — Suppression dépassant 0', () => {
    it('devrait retourner une erreur si le total passe sous 0', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 5, nombreDeChapitresLus: 3, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });

      await expect(controller.removeChapters('550e8400-e29b-41d4-a716-446655440002', { value: 10 })).rejects.toThrow(BadRequestException);
    });
  });

  // ❌ Scénario 4 — Valeur négative invalide
  describe('US 10 — Valeur négative invalide', () => {
    it('devrait retourner une erreur si la valeur est négative', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });

      await expect(controller.removeChapters('550e8400-e29b-41d4-a716-446655440002', { value: -5 })).rejects.toThrow(BadRequestException);
    });
  });

  // ❌ Scénario 5 — lus > nouveau total interdit
  describe('US 10 — lus > nouveau total interdit', () => {
    it('devrait retourner une erreur si lus dépasse le nouveau total', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 95, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });

      await expect(controller.removeChapters('550e8400-e29b-41d4-a716-446655440002', { value: 10 })).rejects.toThrow(BadRequestException);
    });
  });

  // ⚠️ Scénario 6 — Cas limite exact
  describe('US 10 — Cas limite exact', () => {
    it('devrait accepter si lus == nouveau total', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 90, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, nombreDeChapitres: 90 });

      const result = await controller.removeChapters('550e8400-e29b-41d4-a716-446655440002', { value: 10 });

      expect(result.nombreDeChapitres).toBe(90);
      expect(result.nombreDeChapitresLus).toBe(90);
    });
  });

  // ===== US 11 — Supprimer chapitres lus =====

  // ✅ Scénario 1 — Suppression simple
  describe('US 11 — Suppression simple chapitre lu', () => {
    it('devrait décrémenter de 1 le nombre de chapitres lus', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, nombreDeChapitresLus: 49 });

      const result = await controller.removeReadChapters('550e8400-e29b-41d4-a716-446655440002', { value: 1 });

      expect(result.nombreDeChapitresLus).toBe(49);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ✅ Scénario 2 — Suppression multiple
  describe('US 11 — Suppression multiple chapitres lus', () => {
    it('devrait décrémenter de 10 le nombre de chapitres lus', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, nombreDeChapitresLus: 40 });

      const result = await controller.removeReadChapters('550e8400-e29b-41d4-a716-446655440002', { value: 10 });

      expect(result.nombreDeChapitresLus).toBe(40);
    });
  });

  // ❌ Scénario 3 — Descendre sous 0
  describe('US 11 — Descendre sous 0 interdit', () => {
    it('devrait retourner une erreur si lus passe sous 0', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 5, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });

      await expect(controller.removeReadChapters('550e8400-e29b-41d4-a716-446655440002', { value: 10 })).rejects.toThrow(BadRequestException);
    });
  });

  // ❌ Scénario 4 — Valeur négative invalide
  describe('US 11 — Valeur négative invalide', () => {
    it('devrait retourner une erreur si la valeur est négative', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });

      await expect(controller.removeReadChapters('550e8400-e29b-41d4-a716-446655440002', { value: -5 })).rejects.toThrow(BadRequestException);
    });
  });

  // ❌ Scénario 5 — Indépendance avec total
  describe('US 11 — Aucun impact sur total', () => {
    it('devrait ne pas modifier le nombre total de chapitres', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 50, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, nombreDeChapitresLus: 40 });

      const result = await controller.removeReadChapters('550e8400-e29b-41d4-a716-446655440002', { value: 10 });

      expect(result.nombreDeChapitres).toBe(100);
    });
  });

  // ⚠️ Scénario 6 — Passage à 0 exact
  describe('US 11 — Passage à 0 exact', () => {
    it('devrait accepter si lus arrive à 0', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', nombreDeChapitres: 100, nombreDeChapitresLus: 10, activé: true };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, nombreDeChapitresLus: 0 });

      const result = await controller.removeReadChapters('550e8400-e29b-41d4-a716-446655440002', { value: 10 });

      expect(result.nombreDeChapitresLus).toBe(0);
    });
  });
});
