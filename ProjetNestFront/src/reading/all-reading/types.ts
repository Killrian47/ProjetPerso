export type ReadingKind = 'manga' | 'manhwa' | 'manhua';

interface BaseReading {
  id: string;
  titre: string;
  imageUrl?: string;
  nombreDeChapitres: number;
  nombreDeChapitresLus: number;
  activé: boolean;
}

export interface Manga extends BaseReading {
  kind: 'manga';
  auteur: string;
}

export interface Manhwa extends BaseReading {
  kind: 'manhwa';
}

export interface Manhua extends BaseReading {
  kind: 'manhua';
}

export type Reading = Manga | Manhwa | Manhua;
