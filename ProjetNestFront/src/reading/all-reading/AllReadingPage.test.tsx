import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AllReadingPage } from './AllReadingPage';
import type { Reading } from './types';

const sample: Reading[] = [
  {
    id: '1',
    titre: 'One Piece',
    kind: 'manga',
    auteur: 'Eiichiro Oda',
    nombreDeChapitresLus: 25,
    nombreDeChapitres: 50,
    activé: true,
  },
  {
    id: '2',
    titre: 'Solo Leveling',
    kind: 'manhwa',
    nombreDeChapitresLus: 100,
    nombreDeChapitres: 200,
    activé: true,
  },
  {
    id: '3',
    titre: 'Tales of Demons',
    kind: 'manhua',
    nombreDeChapitresLus: 10,
    nombreDeChapitres: 40,
    activé: true,
  },
];

function routePayload(url: string, data: Reading[]) {
  if (url.includes('getAllManga')) return data.filter((r) => r.kind === 'manga');
  if (url.includes('getAllManhwa')) return data.filter((r) => r.kind === 'manhwa');
  if (url.includes('getAllManhua')) return data.filter((r) => r.kind === 'manhua');
  return [];
}

function mockFetchResolvedWith(data: Reading[], { delay = 0 } = {}) {
  return vi.fn().mockImplementation((url: string) => {
    const payload = routePayload(url, data);
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            ok: true,
            status: 200,
            json: async () => payload,
          } as Response),
        delay,
      ),
    );
  });
}

function mockFetchRejected() {
  return vi.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({}),
  } as Response);
}

describe('AllReadingPage — US1 Dashboard', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — affiche toutes les œuvres actives (manga + manhwa + manhua)', async () => {
    vi.stubGlobal('fetch', mockFetchResolvedWith(sample));

    render(<AllReadingPage />);

    expect(await screen.findByText('One Piece')).toBeInTheDocument();
    expect(screen.getByText('Solo Leveling')).toBeInTheDocument();
    expect(screen.getByText('Tales of Demons')).toBeInTheDocument();
  });

  it('Scénario 2 — affiche la progression "25 / 50" et "50%"', async () => {
    vi.stubGlobal('fetch', mockFetchResolvedWith([sample[0]]));

    render(<AllReadingPage />);

    expect(await screen.findByText(/25\s*\/\s*50/)).toBeInTheDocument();
    expect(screen.getByText(/50\s*%/)).toBeInTheDocument();
  });

  it('Scénario 3 — affiche "Aucune lecture en cours" si vide', async () => {
    vi.stubGlobal('fetch', mockFetchResolvedWith([]));

    render(<AllReadingPage />);

    expect(await screen.findByText(/aucune lecture en cours/i)).toBeInTheDocument();
  });

  it('Scénario 4 — affiche un loader/skeleton pendant la requête', async () => {
    vi.stubGlobal('fetch', mockFetchResolvedWith(sample, { delay: 50 }));

    render(<AllReadingPage />);

    expect(screen.getByRole('status', { name: /chargement/i })).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByRole('status', { name: /chargement/i })).not.toBeInTheDocument(),
    );
  });

  it('Scénario 5 — affiche un message d\'erreur si l\'API échoue', async () => {
    vi.stubGlobal('fetch', mockFetchRejected());

    render(<AllReadingPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/erreur/i);
  });

  it('Scénario 6 (entité) — n\'affiche pas les œuvres dont activé = false', async () => {
    const mixed: Reading[] = [
      ...sample,
      {
        id: '99',
        titre: 'Manga Désactivé',
        kind: 'manga',
        auteur: 'Anon',
        nombreDeChapitresLus: 0,
        nombreDeChapitres: 10,
        activé: false,
      },
    ];
    vi.stubGlobal('fetch', mockFetchResolvedWith(mixed));

    render(<AllReadingPage />);

    expect(await screen.findByText('One Piece')).toBeInTheDocument();
    expect(screen.queryByText('Manga Désactivé')).not.toBeInTheDocument();
  });

  it('Scénario 7 (entité) — affiche l\'auteur pour un manga', async () => {
    vi.stubGlobal('fetch', mockFetchResolvedWith([sample[0]]));

    render(<AllReadingPage />);

    expect(await screen.findByText(/eiichiro oda/i)).toBeInTheDocument();
  });

  it('Scénario 8 (entité) — affiche l\'image de couverture si imageUrl présent', async () => {
    const withImage: Reading[] = [
      { ...(sample[0] as Reading), imageUrl: 'https://cdn.example/op.jpg' },
    ];
    vi.stubGlobal('fetch', mockFetchResolvedWith(withImage));

    render(<AllReadingPage />);

    const img = await screen.findByAltText(/couverture de one piece/i);
    expect(img).toHaveAttribute('src', 'https://cdn.example/op.jpg');
  });

  it('Scénario 9 — une carte manga expose les boutons d\'action (+1 lu / +1 chapitre / Désactiver)', async () => {
    vi.stubGlobal('fetch', mockFetchResolvedWith(sample));

    render(<AllReadingPage />);

    const onePieceTitle = await screen.findByText('One Piece');
    const card = onePieceTitle.closest('li') as HTMLElement;
    const inCard = within(card);
    expect(inCard.getByRole('button', { name: /\+1 lu/i })).toBeInTheDocument();
    expect(inCard.getByRole('button', { name: /\+1 chapitre/i })).toBeInTheDocument();
    expect(inCard.getByRole('button', { name: /désactiver/i })).toBeInTheDocument();
  });

  it('Scénario 10 — une carte manhwa et manhua exposent aussi les boutons d\'action', async () => {
    vi.stubGlobal('fetch', mockFetchResolvedWith(sample));

    render(<AllReadingPage />);

    const manhwaTitle = await screen.findByText('Solo Leveling');
    const manhwaCard = manhwaTitle.closest('li') as HTMLElement;
    expect(within(manhwaCard).getByRole('button', { name: /\+1 lu/i })).toBeInTheDocument();
    expect(within(manhwaCard).getByRole('button', { name: /désactiver/i })).toBeInTheDocument();

    const manhuaTitle = screen.getByText('Tales of Demons');
    const manhuaCard = manhuaTitle.closest('li') as HTMLElement;
    expect(within(manhuaCard).getByRole('button', { name: /\+1 lu/i })).toBeInTheDocument();
    expect(within(manhuaCard).getByRole('button', { name: /désactiver/i })).toBeInTheDocument();
  });

  it('Scénario 11 — désactiver un manga le retire de la liste', async () => {
    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (!init || init.method === undefined || init.method === 'GET') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => routePayload(url, sample),
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

    render(<AllReadingPage />);

    const onePieceTitle = await screen.findByText('One Piece');
    const card = onePieceTitle.closest('li') as HTMLElement;
    const inCard = within(card);

    await user.click(inCard.getByRole('button', { name: /désactiver/i }));
    await user.click(inCard.getByRole('button', { name: /confirmer/i }));

    await waitFor(() => expect(screen.queryByText('One Piece')).not.toBeInTheDocument());
    expect(screen.getByText('Solo Leveling')).toBeInTheDocument();
    expect(screen.getByText('Tales of Demons')).toBeInTheDocument();
  });
});
