import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { GetAllReadingController } from './get-all-reading.controller.js';
import { GetAllReadingService } from './get-all-reading.service.js';

describe('GetAllReading (US 4)', () => {
  let controller: GetAllReadingController;

  const mockMangaRepository: any = {
    find: jest.fn(),
  };

  const mockManhwaRepository: any = {
    find: jest.fn(),
  };

  const mockManhuaRepository: any = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllReadingController],
      providers: [
        GetAllReadingService,
        { provide: 'MangaRepository', useValue: mockMangaRepository },
        { provide: 'ManhwaRepository', useValue: mockManhwaRepository },
        { provide: 'ManhuaRepository', useValue: mockManhuaRepository },
      ],
    }).compile();

    controller = module.get<GetAllReadingController>(GetAllReadingController);

    jest.clearAllMocks();
  });

  // ===== US 4 — Voir toutes les lectures =====
  describe('US 4 — Voir toutes les lectures', () => {
    // ✅ Scénario 1 — Des œuvres actives existent
    describe('Scénario 1 — Des œuvres actives existent', () => {
      it('devrait retourner toutes les œuvres actives', async () => {
        const mangas = [
          { id: 1, titre: 'One Piece', activé: true, nombreDeChapitres: 1100, nombreDeChapitresLus: 500, imageUrl: null, auteur: 'Oda' },
        ];
        const manhwas = [
          { id: 1, titre: 'Solo Leveling', activé: true, nombreDeChapitres: 200, nombreDeChapitresLus: 100, imageUrl: null },
        ];
        const manhuas = [
          { id: 1, titre: 'Soul Land', activé: true, nombreDeChapitres: 300, nombreDeChapitresLus: 50, imageUrl: null },
        ];

        mockMangaRepository.find.mockResolvedValue(mangas);
        mockManhwaRepository.find.mockResolvedValue(manhwas);
        mockManhuaRepository.find.mockResolvedValue(manhuas);

        const result = await controller.getAllReading();

        expect(result).toHaveLength(3);
        expect(mockMangaRepository.find).toHaveBeenCalledWith({ where: { activé: true } });
        expect(mockManhwaRepository.find).toHaveBeenCalledWith({ where: { activé: true } });
        expect(mockManhuaRepository.find).toHaveBeenCalledWith({ where: { activé: true } });
      });
    });

    // ❌ Scénario 2 — Aucune œuvre
    describe('Scénario 2 — Aucune œuvre', () => {
      it('devrait retourner un tableau vide', async () => {
        mockMangaRepository.find.mockResolvedValue([]);
        mockManhwaRepository.find.mockResolvedValue([]);
        mockManhuaRepository.find.mockResolvedValue([]);

        const result = await controller.getAllReading();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });
    });
  });
});
