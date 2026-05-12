import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MangaListPage } from './MangaListPage';
import type { Manga } from '@/reading/all-reading/types';

const mangas: Manga[] = [
  {
    id: 'm1',
    titre: 'Berserk',
    kind: 'manga',
    auteur: 'Kentaro Miura',
    nombreDeChapitresLus: 100,
    nombreDeChapitres: 370,
    activé: true,
  },
  {
    id: 'm2',
    titre: 'Vagabond',
    kind: 'manga',
    auteur: 'Takehiko Inoue',
    nombreDeChapitresLus: 200,
    nombreDeChapitres: 327,
    activé: true,
  },
  {
    id: 'm3',
    titre: 'Bleach',
    kind: 'manga',
    auteur: 'Tite Kubo',
    nombreDeChapitresLus: 686,
    nombreDeChapitres: 686,
    activé: true,
  },
];

function mockFetchOk(data: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => data,
  } as Response);
}

describe('MangaListPage — US3 Voir la liste des mangas', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — affiche tous les mangas actifs', async () => {
    vi.stubGlobal('fetch', mockFetchOk(mangas));

    render(<MangaListPage />);

    expect(await screen.findByText('Berserk')).toBeInTheDocument();
    expect(screen.getByText('Vagabond')).toBeInTheDocument();
    expect(screen.getByText('Bleach')).toBeInTheDocument();
  });

  it('Scénario 1bis (entité) — affiche aussi les mangas inactifs (activé = false)', async () => {
    const mixed: Manga[] = [
      ...mangas,
      {
        id: 'm4',
        titre: 'Manga Inactif',
        kind: 'manga',
        auteur: 'Anon',
        nombreDeChapitresLus: 0,
        nombreDeChapitres: 10,
        activé: false,
      },
    ];
    vi.stubGlobal('fetch', mockFetchOk(mixed));

    render(<MangaListPage />);

    expect(await screen.findByText('Berserk')).toBeInTheDocument();
    expect(screen.getByText('Manga Inactif')).toBeInTheDocument();
  });

  it('Scénario 2 — affiche un état vide si aucun manga', async () => {
    vi.stubGlobal('fetch', mockFetchOk([]));

    render(<MangaListPage />);

    expect(await screen.findByText(/aucun manga/i)).toBeInTheDocument();
  });

  it('Scénario 3 — filtre par titre via la barre de recherche', async () => {
    vi.stubGlobal('fetch', mockFetchOk(mangas));
    const user = userEvent.setup();

    render(<MangaListPage />);

    await screen.findByText('Berserk');

    const search = screen.getByRole('searchbox', { name: /rechercher/i });
    await user.type(search, 'vaga');

    expect(screen.getByText('Vagabond')).toBeInTheDocument();
    expect(screen.queryByText('Berserk')).not.toBeInTheDocument();
    expect(screen.queryByText('Bleach')).not.toBeInTheDocument();
  });

  it('Scénario 3bis — message si aucun résultat de recherche', async () => {
    vi.stubGlobal('fetch', mockFetchOk(mangas));
    const user = userEvent.setup();

    render(<MangaListPage />);

    await screen.findByText('Berserk');

    const search = screen.getByRole('searchbox', { name: /rechercher/i });
    await user.type(search, 'zzz-introuvable');

    expect(screen.getByText(/aucun.*résultat/i)).toBeInTheDocument();
  });

  it('Scénario 4 — chaque carte expose les boutons +1 lu / +1 chapitre / Désactiver', async () => {
    vi.stubGlobal('fetch', mockFetchOk(mangas));

    render(<MangaListPage />);

    const berserkTitle = await screen.findByText('Berserk');
    const card = berserkTitle.closest('li');
    expect(card).not.toBeNull();
    const inCard = within(card as HTMLElement);
    expect(inCard.getByRole('button', { name: /\+1 lu/i })).toBeInTheDocument();
    expect(inCard.getByRole('button', { name: /\+1 chapitre/i })).toBeInTheDocument();
    expect(inCard.getByRole('button', { name: /désactiver/i })).toBeInTheDocument();
  });

  it('Scénario 5 — désactiver un manga le retire de la liste', async () => {
    const fetchMock = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      if (!init || init.method === undefined || init.method === 'GET') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mangas,
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({}),
      } as Response);
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<MangaListPage />);

    const berserkTitle = await screen.findByText('Berserk');
    const card = berserkTitle.closest('li') as HTMLElement;
    const inCard = within(card);

    await user.click(inCard.getByRole('button', { name: /désactiver/i }));
    await user.click(inCard.getByRole('button', { name: /confirmer/i }));

    await waitFor(() => expect(screen.queryByText('Berserk')).not.toBeInTheDocument());
    // les autres mangas restent
    expect(screen.getByText('Vagabond')).toBeInTheDocument();
    expect(screen.getByText('Bleach')).toBeInTheDocument();
  });
});
