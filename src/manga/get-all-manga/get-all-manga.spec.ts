import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { GetAllMangaController } from './get-all-manga.controller.js';
import { GetAllMangaService } from './get-all-manga.service.js';

describe('GetAllManga (US 5)', () => {
  let controller: GetAllMangaController;

  const mockRepository: any = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllMangaController],
      providers: [
        GetAllMangaService,
        { provide: 'MangaRepository', useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<GetAllMangaController>(GetAllMangaController);

    jest.clearAllMocks();
  });

  // ✅ Scénario 1 — Des mangas actifs ou non existent
  describe('Scénario 1 — Des mangas existent', () => {
    it('devrait retourner tous les mangas activés ou non', async () => {
      const mangas = [
        { id: 1, titre: 'One Piece', auteur: 'Oda', activé: true, nombreDeChapitres: 1100, nombreDeChapitresLus: 500, imageUrl: null },
        { id: 2, titre: 'Bleach', auteur: 'Kubo', activé: false, nombreDeChapitres: 686, nombreDeChapitresLus: 686, imageUrl: null },
      ];

      mockRepository.find.mockResolvedValue(mangas);

      const result = await controller.getAllManga();

      expect(result).toEqual(mangas);
      expect(result).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  // ❌ Scénario 2 — Aucun manga
  describe('Scénario 2 — Aucun manga', () => {
    it('devrait retourner un tableau vide', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await controller.getAllManga();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
