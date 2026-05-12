import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MangaProgressCard } from './MangaProgressCard';
import type { Manga } from '@/reading/all-reading/types';

const inProgress: Manga = {
  id: 'm1',
  titre: 'Berserk',
  kind: 'manga',
  auteur: 'Kentaro Miura',
  nombreDeChapitresLus: 25,
  nombreDeChapitres: 50,
  activé: true,
};

const completed: Manga = {
  ...inProgress,
  id: 'm2',
  titre: 'Bleach',
  nombreDeChapitresLus: 686,
  nombreDeChapitres: 686,
};

function mockFetchOk(body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => body,
  } as Response);
}

function mockFetchSlowOk(body: unknown, delay = 80) {
  return vi.fn().mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              status: 200,
              json: async () => body,
            } as Response),
          delay,
        ),
      ),
  );
}

function mockFetchError() {
  return vi.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({}),
  } as Response);
}

function mockFetchSlowError(delay = 80) {
  return vi.fn().mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: false,
              status: 500,
              json: async () => ({}),
            } as Response),
          delay,
        ),
      ),
  );
}

describe('MangaProgressCard — US4 Modifier progression manga', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — clic "+1 lu" → UI mise à jour (optimistic) + appel API', async () => {
    const fetchMock = mockFetchSlowOk({ ...inProgress, nombreDeChapitresLus: 26 });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<MangaProgressCard manga={inProgress} />);

    expect(screen.getByText(/25\s*\/\s*50/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /\+1 lu/i }));

    // optimistic : la valeur change avant la fin de la requête
    expect(screen.getByText(/26\s*\/\s*50/)).toBeInTheDocument();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/m1/);
    expect(init.method).toMatch(/POST|PATCH/);
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body as string)).toEqual({ value: 1 });
  });

  it('Scénario 2 — clic "+1 chapitre" → total augmente', async () => {
    const fetchMock = mockFetchOk({ ...inProgress, nombreDeChapitres: 51 });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<MangaProgressCard manga={inProgress} />);

    await user.click(screen.getByRole('button', { name: /\+1 chapitre/i }));

    expect(screen.getByText(/25\s*\/\s*51/)).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body as string)).toEqual({ value: 1 });
  });

  it('Scénario 3 — empêche "+1 lu" quand lus = total', async () => {
    const fetchMock = mockFetchOk(completed);
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<MangaProgressCard manga={completed} />);

    await user.click(screen.getByRole('button', { name: /\+1 lu/i }));

    expect(
      await screen.findByText(/tous les chapitres.*lus|d.+passement|maximum atteint/i),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    // valeur inchangée
    expect(screen.getByText(/686\s*\/\s*686/)).toBeInTheDocument();
  });

  it('Scénario 4 — rollback si l\'API échoue après optimistic update', async () => {
    const fetchMock = mockFetchSlowError();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<MangaProgressCard manga={inProgress} />);

    await user.click(screen.getByRole('button', { name: /\+1 lu/i }));

    // optimistic immédiat
    expect(screen.getByText(/26\s*\/\s*50/)).toBeInTheDocument();

    // après erreur API → rollback à 25/50 + message d'erreur
    await waitFor(() => expect(screen.getByText(/25\s*\/\s*50/)).toBeInTheDocument());
    expect(screen.getByRole('alert')).toHaveTextContent(/erreur/i);
  });
});

describe('MangaProgressCard — US5 Désactiver un manga', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — clic "Désactiver" affiche une demande de confirmation', async () => {
    const user = userEvent.setup();
    render(<MangaProgressCard manga={inProgress} />);

    // pas de confirmation visible au départ
    expect(screen.queryByRole('button', { name: /confirmer/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /désactiver/i }));

    // confirmation visible : message + boutons Confirmer / Annuler
    expect(screen.getByText(/êtes-vous sûr|confirmer la désactivation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
  });

  it('Scénario 2 — confirmation → appel API + callback onDeactivated', async () => {
    const fetchMock = mockFetchOk({ ...inProgress, activé: false });
    vi.stubGlobal('fetch', fetchMock);
    const onDeactivated = vi.fn();
    const user = userEvent.setup();

    render(<MangaProgressCard manga={inProgress} onDeactivated={onDeactivated} />);

    await user.click(screen.getByRole('button', { name: /désactiver/i }));
    await user.click(screen.getByRole('button', { name: /confirmer/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/m1/);
    expect(init.method).toMatch(/POST|PATCH|DELETE/);

    await waitFor(() => expect(onDeactivated).toHaveBeenCalledWith('m1'));
  });

  it('Scénario 3 — annulation → aucun appel API, manga toujours visible', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const onDeactivated = vi.fn();
    const user = userEvent.setup();

    render(<MangaProgressCard manga={inProgress} onDeactivated={onDeactivated} />);

    await user.click(screen.getByRole('button', { name: /désactiver/i }));
    await user.click(screen.getByRole('button', { name: /annuler/i }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(onDeactivated).not.toHaveBeenCalled();
    // la confirmation disparaît
    expect(screen.queryByRole('button', { name: /confirmer/i })).not.toBeInTheDocument();
    // la carte est toujours là
    expect(screen.getByText('Berserk')).toBeInTheDocument();
  });

  it('Scénario 4 — erreur API → rollback (manga reste visible) + message d\'erreur', async () => {
    const fetchMock = mockFetchError();
    vi.stubGlobal('fetch', fetchMock);
    const onDeactivated = vi.fn();
    const user = userEvent.setup();

    render(<MangaProgressCard manga={inProgress} onDeactivated={onDeactivated} />);

    await user.click(screen.getByRole('button', { name: /désactiver/i }));
    await user.click(screen.getByRole('button', { name: /confirmer/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(onDeactivated).not.toHaveBeenCalled();
    expect(await screen.findByRole('alert')).toHaveTextContent(/erreur/i);
    // la carte est toujours là
    expect(screen.getByText('Berserk')).toBeInTheDocument();
  });
});
