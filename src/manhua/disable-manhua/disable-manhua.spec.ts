import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { DisableManhuaController } from './disable-manhua.controller.js';
import { DisableManhuaService } from './disable-manhua.service.js';
import { NotFoundException } from '@nestjs/common';

describe('DisableManhua (US 14)', () => {
  let controller: DisableManhuaController;

  const mockRepository: any = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisableManhuaController],
      providers: [
        DisableManhuaService,
        { provide: 'ManhuaRepository', useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<DisableManhuaController>(DisableManhuaController);

    jest.clearAllMocks();
  });

  // ✅ Scénario 1 — Désactiver un manhua actif
  describe('Scénario 1 — Désactiver un manhua actif', () => {
    it('devrait passer activé à false', async () => {
      const manhua = { id: '550e8400-e29b-41d4-a716-446655440002', titre: 'Soul Land', activé: true, nombreDeChapitres: 300, nombreDeChapitresLus: 50, imageUrl: null };

      mockRepository.findOneBy.mockResolvedValue({ ...manhua });
      mockRepository.save.mockResolvedValue({ ...manhua, activé: false });

      const result = await controller.disableManhua('550e8400-e29b-41d4-a716-446655440002');

      expect(result.activé).toBe(false);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 2 — Manhua inexistant
  describe('Scénario 2 — Manhua inexistant', () => {
    it('devrait retourner une erreur si le manhua n\'existe pas', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(controller.disableManhua('00000000-0000-0000-0000-000000000000')).rejects.toThrow(NotFoundException);
    });
  });
});
