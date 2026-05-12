import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ManhuaProgressCard } from './ManhuaProgressCard';
import type { Manhua } from '@/reading/all-reading/types';

const inProgress: Manhua = {
  id: 'mh1',
  titre: 'Tales of Demons',
  kind: 'manhua',
  nombreDeChapitresLus: 10,
  nombreDeChapitres: 40,
  activé: true,
};

const completed: Manhua = {
  ...inProgress,
  id: 'mh2',
  titre: 'Soul Land',
  nombreDeChapitresLus: 300,
  nombreDeChapitres: 300,
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

describe('ManhuaProgressCard — Modifier progression manhua', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — clic "+1 lu" → optimistic + body { value: 1 }', async () => {
    const fetchMock = mockFetchSlowOk({ ...inProgress, nombreDeChapitresLus: 11 });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<ManhuaProgressCard manhua={inProgress} />);
    expect(screen.getByText(/10\s*\/\s*40/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /\+1 lu/i }));
    expect(screen.getByText(/11\s*\/\s*40/)).toBeInTheDocument();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/manhua\/mh1\/addReadChapters/);
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body as string)).toEqual({ value: 1 });
  });

  it('Scénario 2 — clic "+1 chapitre" → total augmente, body { value: 1 }', async () => {
    const fetchMock = mockFetchOk({ ...inProgress, nombreDeChapitres: 41 });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<ManhuaProgressCard manhua={inProgress} />);

    await user.click(screen.getByRole('button', { name: /\+1 chapitre/i }));
    expect(screen.getByText(/10\s*\/\s*41/)).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/manhua\/mh1\/addChapters/);
    expect(JSON.parse(init.body as string)).toEqual({ value: 1 });
  });

  it('Scénario 3 — empêche "+1 lu" quand lus = total', async () => {
    const fetchMock = mockFetchOk(completed);
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<ManhuaProgressCard manhua={completed} />);

    await user.click(screen.getByRole('button', { name: /\+1 lu/i }));

    expect(
      await screen.findByText(/tous les chapitres.*lus|d.+passement|maximum atteint/i),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText(/300\s*\/\s*300/)).toBeInTheDocument();
  });

  it('Scénario 4 — rollback si l\'API échoue après optimistic update', async () => {
    const fetchMock = mockFetchSlowError();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<ManhuaProgressCard manhua={inProgress} />);

    await user.click(screen.getByRole('button', { name: /\+1 lu/i }));
    expect(screen.getByText(/11\s*\/\s*40/)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/10\s*\/\s*40/)).toBeInTheDocument());
    expect(screen.getByRole('alert')).toHaveTextContent(/erreur/i);
  });
});

describe('ManhuaProgressCard — Désactiver un manhua', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — clic "Désactiver" affiche une demande de confirmation', async () => {
    const user = userEvent.setup();
    render(<ManhuaProgressCard manhua={inProgress} />);

    expect(screen.queryByRole('button', { name: /confirmer/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /désactiver/i }));

    expect(screen.getByText(/êtes-vous sûr|confirmer la désactivation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
  });

  it('Scénario 2 — confirmation → appel API /disableManhua + callback onDeactivated', async () => {
    const fetchMock = mockFetchOk({ ...inProgress, activé: false });
    vi.stubGlobal('fetch', fetchMock);
    const onDeactivated = vi.fn();
    const user = userEvent.setup();

    render(<ManhuaProgressCard manhua={inProgress} onDeactivated={onDeactivated} />);

    await user.click(screen.getByRole('button', { name: /désactiver/i }));
    await user.click(screen.getByRole('button', { name: /confirmer/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/disableManhua\/mh1/);
    expect(init.method).toBe('PATCH');

    await waitFor(() => expect(onDeactivated).toHaveBeenCalledWith('mh1'));
  });

  it('Scénario 3 — annulation → aucun appel API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const onDeactivated = vi.fn();
    const user = userEvent.setup();

    render(<ManhuaProgressCard manhua={inProgress} onDeactivated={onDeactivated} />);

    await user.click(screen.getByRole('button', { name: /désactiver/i }));
    await user.click(screen.getByRole('button', { name: /annuler/i }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(onDeactivated).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /confirmer/i })).not.toBeInTheDocument();
    expect(screen.getByText('Tales of Demons')).toBeInTheDocument();
  });

  it('Scénario 4 — erreur API → rollback (manhua reste visible) + message d\'erreur', async () => {
    const fetchMock = mockFetchError();
    vi.stubGlobal('fetch', fetchMock);
    const onDeactivated = vi.fn();
    const user = userEvent.setup();

    render(<ManhuaProgressCard manhua={inProgress} onDeactivated={onDeactivated} />);

    await user.click(screen.getByRole('button', { name: /désactiver/i }));
    await user.click(screen.getByRole('button', { name: /confirmer/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(onDeactivated).not.toHaveBeenCalled();
    expect(await screen.findByRole('alert')).toHaveTextContent(/erreur/i);
    expect(screen.getByText('Tales of Demons')).toBeInTheDocument();
  });
});
