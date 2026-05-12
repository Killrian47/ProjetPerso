import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddManhwaPage } from './AddManhwaPage';

function mockFetchOk(body: unknown = { id: 'new-1' }) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 201,
    json: async () => body,
  } as Response);
}

function mockFetchError() {
  return vi.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({}),
  } as Response);
}

function mockFetchSlow(delay = 100) {
  return vi.fn().mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              status: 201,
              json: async () => ({ id: 'slow-1' }),
            } as Response),
          delay,
        ),
      ),
  );
}

describe('AddManhwaPage — Ajouter un manhwa', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    if (!('createObjectURL' in URL)) {
      // @ts-expect-error jsdom polyfill
      URL.createObjectURL = () => 'blob:mock-preview';
    } else {
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-preview');
    }
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — formulaire valide → submit → création réussie', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<AddManhwaPage />);

    await user.type(screen.getByLabelText(/titre/i), 'Solo Leveling');
    await user.type(screen.getByLabelText(/chapitres totaux/i), '200');
    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/addManhwa/);
    expect(init.method).toBe('POST');
    const body = init.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('titre')).toBe('Solo Leveling');
    expect(body.get('nombreDeChapitres')).toBe('200');

    expect(await screen.findByText(/manhwa ajouté/i)).toBeInTheDocument();
  });

  it('Scénario 2 — titre vide → erreur de validation', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<AddManhwaPage />);

    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    expect(await screen.findByText(/titre.*(requis|obligatoire)/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('Scénario 3 — image sélectionnée → aperçu affiché', async () => {
    vi.stubGlobal('fetch', mockFetchOk());
    const user = userEvent.setup();

    render(<AddManhwaPage />);

    const file = new File(['(binary)'], 'cover.png', { type: 'image/png' });
    const input = screen.getByLabelText(/image|couverture/i) as HTMLInputElement;
    await user.upload(input, file);

    const preview = await screen.findByAltText(/aperçu/i);
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute('src', expect.stringMatching(/^blob:/));
  });

  it('Scénario 4 — submit en cours → bouton désactivé', async () => {
    vi.stubGlobal('fetch', mockFetchSlow(80));
    const user = userEvent.setup();

    render(<AddManhwaPage />);

    await user.type(screen.getByLabelText(/titre/i), 'Tower of God');
    await user.type(screen.getByLabelText(/chapitres totaux/i), '600');

    const submit = screen.getByRole('button', { name: /ajouter/i });
    await user.click(submit);

    expect(submit).toBeDisabled();

    await waitFor(() => expect(submit).not.toBeDisabled());
  });

  it('Scénario 5 — erreur backend → message d\'erreur affiché', async () => {
    vi.stubGlobal('fetch', mockFetchError());
    const user = userEvent.setup();

    render(<AddManhwaPage />);

    await user.type(screen.getByLabelText(/titre/i), 'Noblesse');
    await user.type(screen.getByLabelText(/chapitres totaux/i), '500');
    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/erreur/i);
  });

  it('Scénario 6 (entité) — nombre de chapitres négatif → erreur de validation', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<AddManhwaPage />);

    await user.type(screen.getByLabelText(/titre/i), 'Noblesse');
    await user.type(screen.getByLabelText(/chapitres totaux/i), '-5');
    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    expect(await screen.findByText(/chapitres.*(≥|>=|sup.+|positif)/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
