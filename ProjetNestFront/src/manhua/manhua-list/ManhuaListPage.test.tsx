import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ManhuaListPage } from './ManhuaListPage';
import type { Manhua } from '@/reading/all-reading/types';

const manhuas: Manhua[] = [
  {
    id: 'mh1',
    titre: 'Tales of Demons',
    kind: 'manhua',
    nombreDeChapitresLus: 10,
    nombreDeChapitres: 40,
    activé: true,
  },
  {
    id: 'mh2',
    titre: 'Soul Land',
    kind: 'manhua',
    nombreDeChapitresLus: 100,
    nombreDeChapitres: 300,
    activé: true,
  },
  {
    id: 'mh3',
    titre: 'Battle Through the Heavens',
    kind: 'manhua',
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

describe('ManhuaListPage — Voir la liste des manhuas', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — affiche tous les manhuas actifs', async () => {
    vi.stubGlobal('fetch', mockFetchOk(manhuas));

    render(<ManhuaListPage />);

    expect(await screen.findByText('Tales of Demons')).toBeInTheDocument();
    expect(screen.getByText('Soul Land')).toBeInTheDocument();
    expect(screen.getByText('Battle Through the Heavens')).toBeInTheDocument();
  });

  it('Scénario 1bis (entité) — affiche aussi les manhuas inactifs', async () => {
    const mixed: Manhua[] = [
      ...manhuas,
      {
        id: 'mh4',
        titre: 'Manhua Inactif',
        kind: 'manhua',
        nombreDeChapitresLus: 0,
        nombreDeChapitres: 10,
        activé: false,
      },
    ];
    vi.stubGlobal('fetch', mockFetchOk(mixed));

    render(<ManhuaListPage />);

    expect(await screen.findByText('Tales of Demons')).toBeInTheDocument();
    expect(screen.getByText('Manhua Inactif')).toBeInTheDocument();
  });

  it('Scénario 2 — affiche un état vide si aucun manhua', async () => {
    vi.stubGlobal('fetch', mockFetchOk([]));

    render(<ManhuaListPage />);

    expect(await screen.findByText(/aucun manhua/i)).toBeInTheDocument();
  });

  it('Scénario 3 — filtre par titre via la barre de recherche', async () => {
    vi.stubGlobal('fetch', mockFetchOk(manhuas));
    const user = userEvent.setup();

    render(<ManhuaListPage />);

    await screen.findByText('Tales of Demons');

    const search = screen.getByRole('searchbox', { name: /rechercher/i });
    await user.type(search, 'soul');

    expect(screen.getByText('Soul Land')).toBeInTheDocument();
    expect(screen.queryByText('Tales of Demons')).not.toBeInTheDocument();
    expect(screen.queryByText('Battle Through the Heavens')).not.toBeInTheDocument();
  });

  it('Scénario 3bis — message si aucun résultat de recherche', async () => {
    vi.stubGlobal('fetch', mockFetchOk(manhuas));
    const user = userEvent.setup();

    render(<ManhuaListPage />);

    await screen.findByText('Tales of Demons');

    const search = screen.getByRole('searchbox', { name: /rechercher/i });
    await user.type(search, 'zzz-introuvable');

    expect(screen.getByText(/aucun.*résultat/i)).toBeInTheDocument();
  });

  it('Scénario 4 — chaque carte expose les boutons +1 lu / +1 chapitre / Désactiver', async () => {
    vi.stubGlobal('fetch', mockFetchOk(manhuas));

    render(<ManhuaListPage />);

    const title = await screen.findByText('Tales of Demons');
    const card = title.closest('li') as HTMLElement;
    const inCard = within(card);
    expect(inCard.getByRole('button', { name: /\+1 lu/i })).toBeInTheDocument();
    expect(inCard.getByRole('button', { name: /\+1 chapitre/i })).toBeInTheDocument();
    expect(inCard.getByRole('button', { name: /désactiver/i })).toBeInTheDocument();
  });

  it('Scénario 5 — désactiver un manhua le retire de la liste', async () => {
    const fetchMock = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      if (!init || init.method === undefined || init.method === 'GET') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => manhuas,
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

    render(<ManhuaListPage />);

    const title = await screen.findByText('Tales of Demons');
    const card = title.closest('li') as HTMLElement;
    const inCard = within(card);

    await user.click(inCard.getByRole('button', { name: /désactiver/i }));
    await user.click(inCard.getByRole('button', { name: /confirmer/i }));

    await waitFor(() => expect(screen.queryByText('Tales of Demons')).not.toBeInTheDocument());
    expect(screen.getByText('Soul Land')).toBeInTheDocument();
    expect(screen.getByText('Battle Through the Heavens')).toBeInTheDocument();
  });
});
