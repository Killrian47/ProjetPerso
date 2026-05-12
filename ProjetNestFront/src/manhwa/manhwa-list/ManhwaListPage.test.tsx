import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ManhwaListPage } from './ManhwaListPage';
import type { Manhwa } from '@/reading/all-reading/types';

const manhwas: Manhwa[] = [
  {
    id: 'mw1',
    titre: 'Solo Leveling',
    kind: 'manhwa',
    nombreDeChapitresLus: 100,
    nombreDeChapitres: 200,
    activé: true,
  },
  {
    id: 'mw2',
    titre: 'Tower of God',
    kind: 'manhwa',
    nombreDeChapitresLus: 300,
    nombreDeChapitres: 600,
    activé: true,
  },
  {
    id: 'mw3',
    titre: 'Noblesse',
    kind: 'manhwa',
    nombreDeChapitresLus: 500,
    nombreDeChapitres: 500,
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

describe('ManhwaListPage — Voir la liste des manhwas', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — affiche tous les manhwas actifs', async () => {
    vi.stubGlobal('fetch', mockFetchOk(manhwas));

    render(<ManhwaListPage />);

    expect(await screen.findByText('Solo Leveling')).toBeInTheDocument();
    expect(screen.getByText('Tower of God')).toBeInTheDocument();
    expect(screen.getByText('Noblesse')).toBeInTheDocument();
  });

  it('Scénario 1bis (entité) — affiche aussi les manhwas inactifs', async () => {
    const mixed: Manhwa[] = [
      ...manhwas,
      {
        id: 'mw4',
        titre: 'Manhwa Inactif',
        kind: 'manhwa',
        nombreDeChapitresLus: 0,
        nombreDeChapitres: 10,
        activé: false,
      },
    ];
    vi.stubGlobal('fetch', mockFetchOk(mixed));

    render(<ManhwaListPage />);

    expect(await screen.findByText('Solo Leveling')).toBeInTheDocument();
    expect(screen.getByText('Manhwa Inactif')).toBeInTheDocument();
  });

  it('Scénario 2 — affiche un état vide si aucun manhwa', async () => {
    vi.stubGlobal('fetch', mockFetchOk([]));

    render(<ManhwaListPage />);

    expect(await screen.findByText(/aucun manhwa/i)).toBeInTheDocument();
  });

  it('Scénario 3 — filtre par titre via la barre de recherche', async () => {
    vi.stubGlobal('fetch', mockFetchOk(manhwas));
    const user = userEvent.setup();

    render(<ManhwaListPage />);

    await screen.findByText('Solo Leveling');

    const search = screen.getByRole('searchbox', { name: /rechercher/i });
    await user.type(search, 'tower');

    expect(screen.getByText('Tower of God')).toBeInTheDocument();
    expect(screen.queryByText('Solo Leveling')).not.toBeInTheDocument();
    expect(screen.queryByText('Noblesse')).not.toBeInTheDocument();
  });

  it('Scénario 3bis — message si aucun résultat de recherche', async () => {
    vi.stubGlobal('fetch', mockFetchOk(manhwas));
    const user = userEvent.setup();

    render(<ManhwaListPage />);

    await screen.findByText('Solo Leveling');

    const search = screen.getByRole('searchbox', { name: /rechercher/i });
    await user.type(search, 'zzz-introuvable');

    expect(screen.getByText(/aucun.*résultat/i)).toBeInTheDocument();
  });

  it('Scénario 4 — chaque carte expose les boutons +1 lu / +1 chapitre / Désactiver', async () => {
    vi.stubGlobal('fetch', mockFetchOk(manhwas));

    render(<ManhwaListPage />);

    const title = await screen.findByText('Solo Leveling');
    const card = title.closest('li') as HTMLElement;
    const inCard = within(card);
    expect(inCard.getByRole('button', { name: /\+1 lu/i })).toBeInTheDocument();
    expect(inCard.getByRole('button', { name: /\+1 chapitre/i })).toBeInTheDocument();
    expect(inCard.getByRole('button', { name: /désactiver/i })).toBeInTheDocument();
  });

  it('Scénario 5 — désactiver un manhwa le retire de la liste', async () => {
    const fetchMock = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      if (!init || init.method === undefined || init.method === 'GET') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => manhwas,
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

    render(<ManhwaListPage />);

    const title = await screen.findByText('Solo Leveling');
    const card = title.closest('li') as HTMLElement;
    const inCard = within(card);

    await user.click(inCard.getByRole('button', { name: /désactiver/i }));
    await user.click(inCard.getByRole('button', { name: /confirmer/i }));

    await waitFor(() => expect(screen.queryByText('Solo Leveling')).not.toBeInTheDocument());
    expect(screen.getByText('Tower of God')).toBeInTheDocument();
    expect(screen.getByText('Noblesse')).toBeInTheDocument();
  });
});
