import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ImportWorksController } from './import-works.controller.js';
import { ImportWorksService } from './import-works.service.js';

describe('ImportWorks (US 15 & 16)', () => {
  let controller: ImportWorksController;

  const mockMangaRepository: any = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockManhwaRepository: any = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockManhuaRepository: any = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockScraperService: any = {
    fetchManga: jest.fn(),
    fetchManhwa: jest.fn(),
    fetchManhua: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportWorksController],
      providers: [
        ImportWorksService,
        { provide: 'MangaRepository', useValue: mockMangaRepository },
        { provide: 'ManhwaRepository', useValue: mockManhwaRepository },
        { provide: 'ManhuaRepository', useValue: mockManhuaRepository },
        { provide: 'ScraperService', useValue: mockScraperService },
      ],
    }).compile();

    controller = module.get<ImportWorksController>(ImportWorksController);

    jest.clearAllMocks();
  });

  // ===== US 15 — Import manga (source mangaplus) =====
  describe('US 15 — Import manga', () => {
    // ✅ Scénario 1 — Ajoute mangas manquants
    describe('Scénario 1 — Ajoute mangas manquants', () => {
      it('devrait importer les mangas depuis mangaplus', async () => {
        const mangasFromSource = [
          { titre: 'One Piece', auteur: 'Oda' },
          { titre: 'Naruto', auteur: 'Kishimoto' },
        ];

        mockScraperService.fetchManga.mockResolvedValue(mangasFromSource);
        mockMangaRepository.findOneBy.mockResolvedValue(null);
        mockMangaRepository.create.mockImplementation((data) => data);
        mockMangaRepository.save.mockImplementation((data) => Promise.resolve({ id: 1, ...data }));

        const result = await controller.importManga();

        expect(mockScraperService.fetchManga).toHaveBeenCalled();
        expect(mockMangaRepository.save).toHaveBeenCalledTimes(2);
        expect(result).toHaveLength(2);
      });
    });

    // ❌ Scénario 2 — Pas de duplication manga
    describe('Scénario 2 — Pas de duplication manga', () => {
      it('ne devrait pas importer un manga déjà existant', async () => {
        const mangasFromSource = [
          { titre: 'One Piece', auteur: 'Oda' },
        ];

        const existingManga = { id: 1, titre: 'One Piece', auteur: 'Oda', nombreDeChapitres: 1100 };

        mockScraperService.fetchManga.mockResolvedValue(mangasFromSource);
        mockMangaRepository.findOneBy.mockResolvedValue(existingManga);

        const result = await controller.importManga();

        expect(mockMangaRepository.save).not.toHaveBeenCalled();
        expect(result).toHaveLength(0);
      });
    });
  });

  // ===== US 16 — Import manhwa / manhua (source raijinscan) =====
  describe('US 16 — Import manhwa / manhua', () => {
    // ✅ Scénario 1 — Ajoute manhwas manquants
    describe('Scénario 1 — Ajoute manhwas manquants', () => {
      it('devrait importer les manhwas depuis raijinscan', async () => {
        const manhwasFromSource = [
          { titre: 'Solo Leveling' },
          { titre: 'Tower of God' },
        ];

        mockScraperService.fetchManhwa.mockResolvedValue(manhwasFromSource);
        mockManhwaRepository.findOneBy.mockResolvedValue(null);
        mockManhwaRepository.create.mockImplementation((data) => data);
        mockManhwaRepository.save.mockImplementation((data) => Promise.resolve({ id: 1, ...data }));

        const result = await controller.importManhwa();

        expect(mockScraperService.fetchManhwa).toHaveBeenCalled();
        expect(mockManhwaRepository.save).toHaveBeenCalledTimes(2);
        expect(result).toHaveLength(2);
      });
    });

    // ❌ Scénario 2 — Pas de duplication manhwa
    describe('Scénario 2 — Pas de duplication manhwa', () => {
      it('ne devrait pas importer un manhwa déjà existant', async () => {
        const manhwasFromSource = [
          { titre: 'Solo Leveling' },
        ];

        const existingManhwa = { id: 1, titre: 'Solo Leveling', nombreDeChapitres: 200 };

        mockScraperService.fetchManhwa.mockResolvedValue(manhwasFromSource);
        mockManhwaRepository.findOneBy.mockResolvedValue(existingManhwa);

        const result = await controller.importManhwa();

        expect(mockManhwaRepository.save).not.toHaveBeenCalled();
        expect(result).toHaveLength(0);
      });
    });

    // ✅ Scénario 3 — Ajoute manhuas manquants
    describe('Scénario 3 — Ajoute manhuas manquants', () => {
      it('devrait importer les manhuas depuis raijinscan', async () => {
        const manhuasFromSource = [
          { titre: 'Soul Land' },
          { titre: 'Tales of Demons and Gods' },
        ];

        mockScraperService.fetchManhua.mockResolvedValue(manhuasFromSource);
        mockManhuaRepository.findOneBy.mockResolvedValue(null);
        mockManhuaRepository.create.mockImplementation((data) => data);
        mockManhuaRepository.save.mockImplementation((data) => Promise.resolve({ id: 1, ...data }));

        const result = await controller.importManhua();

        expect(mockScraperService.fetchManhua).toHaveBeenCalled();
        expect(mockManhuaRepository.save).toHaveBeenCalledTimes(2);
        expect(result).toHaveLength(2);
      });
    });

    // ❌ Scénario 4 — Pas de duplication manhua
    describe('Scénario 4 — Pas de duplication manhua', () => {
      it('ne devrait pas importer un manhua déjà existant', async () => {
        const manhuasFromSource = [
          { titre: 'Soul Land' },
        ];

        const existingManhua = { id: 1, titre: 'Soul Land', nombreDeChapitres: 300 };

        mockScraperService.fetchManhua.mockResolvedValue(manhuasFromSource);
        mockManhuaRepository.findOneBy.mockResolvedValue(existingManhua);

        const result = await controller.importManhua();

        expect(mockManhuaRepository.save).not.toHaveBeenCalled();
        expect(result).toHaveLength(0);
      });
    });
  });
});
