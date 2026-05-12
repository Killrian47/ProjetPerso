import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ManhwaProgressCard } from './ManhwaProgressCard';
import type { Manhwa } from '@/reading/all-reading/types';

const inProgress: Manhwa = {
  id: 'mw1',
  titre: 'Solo Leveling',
  kind: 'manhwa',
  nombreDeChapitresLus: 100,
  nombreDeChapitres: 200,
  activé: true,
};

const completed: Manhwa = {
  ...inProgress,
  id: 'mw2',
  titre: 'Tower of God',
  nombreDeChapitresLus: 600,
  nombreDeChapitres: 600,
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

describe('ManhwaProgressCard — Modifier progression manhwa', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — clic "+1 lu" → optimistic + body { value: 1 }', async () => {
    const fetchMock = mockFetchSlowOk({ ...inProgress, nombreDeChapitresLus: 101 });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<ManhwaProgressCard manhwa={inProgress} />);
    expect(screen.getByText(/100\s*\/\s*200/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /\+1 lu/i }));
    expect(screen.getByText(/101\s*\/\s*200/)).toBeInTheDocument();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/manhwa\/mw1\/addReadChapters/);
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body as string)).toEqual({ value: 1 });
  });

  it('Scénario 2 — clic "+1 chapitre" → total augmente, body { value: 1 }', async () => {
    const fetchMock = mockFetchOk({ ...inProgress, nombreDeChapitres: 201 });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<ManhwaProgressCard manhwa={inProgress} />);

    await user.click(screen.getByRole('button', { name: /\+1 chapitre/i }));
    expect(screen.getByText(/100\s*\/\s*201/)).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/manhwa\/mw1\/addChapters/);
    expect(JSON.parse(init.body as string)).toEqual({ value: 1 });
  });

  it('Scénario 3 — empêche "+1 lu" quand lus = total', async () => {
    const fetchMock = mockFetchOk(completed);
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<ManhwaProgressCard manhwa={completed} />);

    await user.click(screen.getByRole('button', { name: /\+1 lu/i }));

    expect(
      await screen.findByText(/tous les chapitres.*lus|d.+passement|maximum atteint/i),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText(/600\s*\/\s*600/)).toBeInTheDocument();
  });

  it('Scénario 4 — rollback si l\'API échoue après optimistic update', async () => {
    const fetchMock = mockFetchSlowError();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<ManhwaProgressCard manhwa={inProgress} />);

    await user.click(screen.getByRole('button', { name: /\+1 lu/i }));
    expect(screen.getByText(/101\s*\/\s*200/)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/100\s*\/\s*200/)).toBeInTheDocument());
    expect(screen.getByRole('alert')).toHaveTextContent(/erreur/i);
  });
});

describe('ManhwaProgressCard — Désactiver un manhwa', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — clic "Désactiver" affiche une demande de confirmation', async () => {
    const user = userEvent.setup();
    render(<ManhwaProgressCard manhwa={inProgress} />);

    expect(screen.queryByRole('button', { name: /confirmer/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /désactiver/i }));

    expect(screen.getByText(/êtes-vous sûr|confirmer la désactivation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
  });

  it('Scénario 2 — confirmation → appel API /disableManhwa + callback onDeactivated', async () => {
    const fetchMock = mockFetchOk({ ...inProgress, activé: false });
    vi.stubGlobal('fetch', fetchMock);
    const onDeactivated = vi.fn();
    const user = userEvent.setup();

    render(<ManhwaProgressCard manhwa={inProgress} onDeactivated={onDeactivated} />);

    await user.click(screen.getByRole('button', { name: /désactiver/i }));
    await user.click(screen.getByRole('button', { name: /confirmer/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/disableManhwa\/mw1/);
    expect(init.method).toBe('PATCH');

    await waitFor(() => expect(onDeactivated).toHaveBeenCalledWith('mw1'));
  });

  it('Scénario 3 — annulation → aucun appel API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const onDeactivated = vi.fn();
    const user = userEvent.setup();

    render(<ManhwaProgressCard manhwa={inProgress} onDeactivated={onDeactivated} />);

    await user.click(screen.getByRole('button', { name: /désactiver/i }));
    await user.click(screen.getByRole('button', { name: /annuler/i }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(onDeactivated).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /confirmer/i })).not.toBeInTheDocument();
    expect(screen.getByText('Solo Leveling')).toBeInTheDocument();
  });

  it('Scénario 4 — erreur API → rollback (manhwa reste visible) + message d\'erreur', async () => {
    const fetchMock = mockFetchError();
    vi.stubGlobal('fetch', fetchMock);
    const onDeactivated = vi.fn();
    const user = userEvent.setup();

    render(<ManhwaProgressCard manhwa={inProgress} onDeactivated={onDeactivated} />);

    await user.click(screen.getByRole('button', { name: /désactiver/i }));
    await user.click(screen.getByRole('button', { name: /confirmer/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(onDeactivated).not.toHaveBeenCalled();
    expect(await screen.findByRole('alert')).toHaveTextContent(/erreur/i);
    expect(screen.getByText('Solo Leveling')).toBeInTheDocument();
  });
});
