import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { GetAllManhwaController } from './get-all-manhwa.controller.js';
import { GetAllManhwaService } from './get-all-manhwa.service.js';

describe('GetAllManhwa (US 6)', () => {
  let controller: GetAllManhwaController;

  const mockRepository: any = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllManhwaController],
      providers: [
        GetAllManhwaService,
        { provide: 'ManhwaRepository', useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<GetAllManhwaController>(GetAllManhwaController);

    jest.clearAllMocks();
  });

  // ✅ Scénario 1 — Des manhwas existent
  describe('Scénario 1 — Des manhwas existent', () => {
    it('devrait retourner tous les manhwas activés ou non', async () => {
      const manhwas = [
        { id: 1, titre: 'Solo Leveling', activé: true, nombreDeChapitres: 200, nombreDeChapitresLus: 100, imageUrl: null },
        { id: 2, titre: 'Tower of God', activé: false, nombreDeChapitres: 550, nombreDeChapitresLus: 300, imageUrl: null },
      ];

      mockRepository.find.mockResolvedValue(manhwas);

      const result = await controller.getAllManhwa();

      expect(result).toEqual(manhwas);
      expect(result).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 2 — Aucun manhwa
  describe('Scénario 2 — Aucun manhwa', () => {
    it('devrait retourner un tableau vide', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await controller.getAllManhwa();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
