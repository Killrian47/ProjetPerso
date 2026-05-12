import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddMangaPage } from './AddMangaPage';

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

describe('AddMangaPage — US2 Ajouter un manga', () => {
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

    render(<AddMangaPage />);

    await user.type(screen.getByLabelText(/titre/i), 'Berserk');
    await user.type(screen.getByLabelText(/auteur/i), 'Kentaro Miura');
    await user.type(screen.getByLabelText(/chapitres totaux/i), '370');
    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe('POST');
    const body = init.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('titre')).toBe('Berserk');
    expect(body.get('auteur')).toBe('Kentaro Miura');
    expect(body.get('nombreDeChapitres')).toBe('370');

    expect(await screen.findByText(/manga ajouté/i)).toBeInTheDocument();
  });

  it('Scénario 2 — titre vide → erreur de validation', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<AddMangaPage />);

    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    expect(await screen.findByText(/titre.*(requis|obligatoire)/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('Scénario 3 — image sélectionnée → aperçu affiché', async () => {
    vi.stubGlobal('fetch', mockFetchOk());
    const user = userEvent.setup();

    render(<AddMangaPage />);

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

    render(<AddMangaPage />);

    await user.type(screen.getByLabelText(/titre/i), 'Vagabond');
    await user.type(screen.getByLabelText(/auteur/i), 'Takehiko Inoue');
    await user.type(screen.getByLabelText(/chapitres totaux/i), '327');

    const submit = screen.getByRole('button', { name: /ajouter/i });
    await user.click(submit);

    expect(submit).toBeDisabled();

    await waitFor(() => expect(submit).not.toBeDisabled());
  });

  it('Scénario 5 — erreur backend → message d\'erreur affiché', async () => {
    vi.stubGlobal('fetch', mockFetchError());
    const user = userEvent.setup();

    render(<AddMangaPage />);

    await user.type(screen.getByLabelText(/titre/i), 'Bleach');
    await user.type(screen.getByLabelText(/auteur/i), 'Tite Kubo');
    await user.type(screen.getByLabelText(/chapitres totaux/i), '700');
    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/erreur/i);
  });

  it('Scénario 6 (entité) — auteur vide → erreur de validation', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<AddMangaPage />);

    await user.type(screen.getByLabelText(/titre/i), 'Naruto');
    await user.type(screen.getByLabelText(/chapitres totaux/i), '700');
    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    expect(await screen.findByText(/auteur.*(requis|obligatoire)/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('Scénario 7 (entité) — nombre de chapitres négatif → erreur de validation', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<AddMangaPage />);

    await user.type(screen.getByLabelText(/titre/i), 'Naruto');
    await user.type(screen.getByLabelText(/auteur/i), 'Masashi Kishimoto');
    await user.type(screen.getByLabelText(/chapitres totaux/i), '-5');
    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    expect(await screen.findByText(/chapitres.*(≥|>=|sup.+|positif)/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
