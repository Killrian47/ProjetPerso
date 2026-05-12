import { describe, it, expect } from '@jest/globals';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AddMangaDto } from '../manga/add-manga/add-manga.dto.js';
import { AddManhwaDto } from '../manhwa/add-manhwa/add-manhwa.dto.js';
import { AddManhuaDto } from '../manhua/add-manhua/add-manhua.dto.js';
import { UpdateChaptersDto } from '../manga/update-chapters/update-chapters.dto.js';

describe('Validation (US 17 & 18)', () => {

  // ===== US 17 — Validation stricte =====
  describe('US 17 — Validation stricte', () => {
    // ❌ Scénario 1 — Titre obligatoire (Manga)
    describe('Scénario 1 — Titre obligatoire (Manga)', () => {
      it('devrait rejeter un manga sans titre', async () => {
        const dto = plainToInstance(AddMangaDto, { auteur: 'Oda', nombreDeChapitres: 100 });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'titre')).toBe(true);
      });

      it('devrait rejeter un manga avec titre vide', async () => {
        const dto = plainToInstance(AddMangaDto, { titre: '', auteur: 'Oda', nombreDeChapitres: 100 });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'titre')).toBe(true);
      });
    });

    // ❌ Scénario 2 — Titre obligatoire (Manhwa)
    describe('Scénario 2 — Titre obligatoire (Manhwa)', () => {
      it('devrait rejeter un manhwa sans titre', async () => {
        const dto = plainToInstance(AddManhwaDto, { nombreDeChapitres: 100 });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'titre')).toBe(true);
      });
    });

    // ❌ Scénario 3 — Titre obligatoire (Manhua)
    describe('Scénario 3 — Titre obligatoire (Manhua)', () => {
      it('devrait rejeter un manhua sans titre', async () => {
        const dto = plainToInstance(AddManhuaDto, { nombreDeChapitres: 100 });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'titre')).toBe(true);
      });
    });

    // ❌ Scénario 4 — Auteur obligatoire (Manga)
    describe('Scénario 4 — Auteur obligatoire (Manga)', () => {
      it('devrait rejeter un manga sans auteur', async () => {
        const dto = plainToInstance(AddMangaDto, { titre: 'One Piece', nombreDeChapitres: 100 });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'auteur')).toBe(true);
      });
    });

    // 🔢 Scénario 5 — Chapitres ≥ 0
    describe('Scénario 5 — Chapitres ≥ 0', () => {
      it('devrait rejeter un manga avec chapitres négatifs', async () => {
        const dto = plainToInstance(AddMangaDto, { titre: 'One Piece', auteur: 'Oda', nombreDeChapitres: -5 });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'nombreDeChapitres')).toBe(true);
      });

      it('devrait accepter un manga avec chapitres = 0', async () => {
        const dto = plainToInstance(AddMangaDto, { titre: 'One Piece', auteur: 'Oda', nombreDeChapitres: 0 });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      });
    });

    // ✅ Scénario 6 — Données valides acceptées
    describe('Scénario 6 — Données valides acceptées', () => {
      it('devrait accepter un manga valide complet', async () => {
        const dto = plainToInstance(AddMangaDto, { titre: 'Naruto', auteur: 'Kishimoto', nombreDeChapitres: 700 });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      });

      it('devrait accepter un manhwa valide', async () => {
        const dto = plainToInstance(AddManhwaDto, { titre: 'Solo Leveling', nombreDeChapitres: 200 });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      });

      it('devrait accepter un manhua valide', async () => {
        const dto = plainToInstance(AddManhuaDto, { titre: 'Soul Land', nombreDeChapitres: 300 });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      });
    });
  });

  // ===== US 18 — Cohérence =====
  describe('US 18 — Cohérence', () => {
    // ❌ Scénario 1 — Pas de valeurs négatives (UpdateChaptersDto)
    describe('Scénario 1 — Pas de valeurs négatives (UpdateChaptersDto)', () => {
      it('devrait rejeter une valeur négative', async () => {
        const dto = plainToInstance(UpdateChaptersDto, { value: -1 });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'value')).toBe(true);
      });

      it('devrait rejeter la valeur 0', async () => {
        const dto = plainToInstance(UpdateChaptersDto, { value: 0 });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'value')).toBe(true);
      });

      it('devrait accepter une valeur positive', async () => {
        const dto = plainToInstance(UpdateChaptersDto, { value: 5 });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      });
    });

    // ❌ Scénario 2 — Cohérence chapitres (pas de dépassement / pas de négatifs)
    describe('Scénario 2 — Cohérence chapitres', () => {
      it('devrait rejeter un manhwa avec chapitres négatifs', async () => {
        const dto = plainToInstance(AddManhwaDto, { titre: 'Test', nombreDeChapitres: -10 });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });

      it('devrait rejeter un manhua avec chapitres négatifs', async () => {
        const dto = plainToInstance(AddManhuaDto, { titre: 'Test', nombreDeChapitres: -10 });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });
});
