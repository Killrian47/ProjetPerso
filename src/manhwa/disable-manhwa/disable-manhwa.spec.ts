import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { DisableManhwaController } from './disable-manhwa.controller.js';
import { DisableManhwaService } from './disable-manhwa.service.js';
import { NotFoundException } from '@nestjs/common';

describe('DisableManhwa (US 13)', () => {
  let controller: DisableManhwaController;

  const mockRepository: any = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisableManhwaController],
      providers: [
        DisableManhwaService,
        { provide: 'ManhwaRepository', useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<DisableManhwaController>(DisableManhwaController);

    jest.clearAllMocks();
  });

  // ===== US 13 — Désactiver un manhwa =====
  describe('US 13 — Désactiver un manhwa', () => {
    // ✅ Scénario 1 — Désactiver un manhwa actif
    describe('Scénario 1 — Désactiver un manhwa actif', () => {
      it('devrait passer activé à false', async () => {
        const manhwa = { id: '550e8400-e29b-41d4-a716-446655440001', titre: 'Solo Leveling', activé: true, nombreDeChapitres: 200, nombreDeChapitresLus: 100, imageUrl: null };

        mockRepository.findOneBy.mockResolvedValue({ ...manhwa });
        mockRepository.save.mockResolvedValue({ ...manhwa, activé: false });

        const result = await controller.disableManhwa('550e8400-e29b-41d4-a716-446655440001');

        expect(result.activé).toBe(false);
        expect(mockRepository.save).toHaveBeenCalled();
      });
    });

    // ❌ Scénario 2 — Manhwa inexistant
    describe('Scénario 2 — Manhwa inexistant', () => {
      it("devrait retourner une erreur si le manhwa n'existe pas", async () => {
        mockRepository.findOneBy.mockResolvedValue(null);

        await expect(controller.disableManhwa('00000000-0000-0000-0000-000000000000')).rejects.toThrow(NotFoundException);
      });
    });
  });
});
