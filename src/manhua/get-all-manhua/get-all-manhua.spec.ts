import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { GetAllManhuaController } from './get-all-manhua.controller.js';
import { GetAllManhuaService } from './get-all-manhua.service.js';

describe('GetAllManhua (US 7)', () => {
  let controller: GetAllManhuaController;

  const mockRepository: any = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllManhuaController],
      providers: [
        GetAllManhuaService,
        { provide: 'ManhuaRepository', useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<GetAllManhuaController>(GetAllManhuaController);

    jest.clearAllMocks();
  });

  // ===== US 7 — Voir tous les manhuas =====
  describe('US 7 — Voir tous les manhuas', () => {
    // ✅ Scénario 1 — Des manhuas existent
    describe('Scénario 1 — Des manhuas existent', () => {
      it('devrait retourner tous les manhuas activés ou non', async () => {
        const manhuas = [
          { id: 1, titre: 'Soul Land', activé: true, nombreDeChapitres: 300, nombreDeChapitresLus: 50, imageUrl: null },
          { id: 2, titre: 'Tales of Demons and Gods', activé: false, nombreDeChapitres: 450, nombreDeChapitresLus: 200, imageUrl: null },
        ];

        mockRepository.find.mockResolvedValue(manhuas);

        const result = await controller.getAllManhua();

        expect(result).toEqual(manhuas);
        expect(result).toHaveLength(2);
        expect(mockRepository.find).toHaveBeenCalled();
      });
    });

    // ❌ Scénario 2 — Aucun manhua
    describe('Scénario 2 — Aucun manhua', () => {
      it('devrait retourner un tableau vide', async () => {
        mockRepository.find.mockResolvedValue([]);

        const result = await controller.getAllManhua();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });
    });
  });
});
