import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AddWorkMenu } from './AddWorkMenu';

function renderInRouter() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AddWorkMenu />
    </MemoryRouter>,
  );
}

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

async function openAndPick(user: ReturnType<typeof userEvent.setup>, type: RegExp) {
  await user.click(screen.getByRole('button', { name: /ajouter une œuvre/i }));
  const dialog = screen.getByRole('dialog');
  await user.click(within(dialog).getByRole('button', { name: type }));
}

describe('AddWorkMenu — ouverture / fermeture', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 1 — la modale est fermée par défaut', () => {
    renderInRouter();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Scénario 2 — clic sur "+" ouvre la modale avec les 3 choix', async () => {
    const user = userEvent.setup();
    renderInRouter();

    await user.click(screen.getByRole('button', { name: /ajouter une œuvre/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /manga/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /manhwa/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /manhua/i })).toBeInTheDocument();
  });

  it('Scénario 3 — bouton "Fermer" ferme la modale', async () => {
    const user = userEvent.setup();
    renderInRouter();

    await user.click(screen.getByRole('button', { name: /ajouter une œuvre/i }));
    await user.click(screen.getByRole('button', { name: /fermer/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Scénario 4 — touche Échap ferme la modale', async () => {
    const user = userEvent.setup();
    renderInRouter();

    await user.click(screen.getByRole('button', { name: /ajouter une œuvre/i }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Scénario 5 — clic sur le fond ferme la modale', async () => {
    const user = userEvent.setup();
    renderInRouter();

    await user.click(screen.getByRole('button', { name: /ajouter une œuvre/i }));
    await user.click(screen.getByTestId('modal-backdrop'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('AddWorkMenu — choix du type → formulaire dans la modale', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('Scénario 6 — choisir "Manga" affiche le formulaire avec champs titre + auteur + chapitres', async () => {
    const user = userEvent.setup();
    renderInRouter();
    await openAndPick(user, /manga/i);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByLabelText(/titre/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/auteur/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/chapitres totaux/i)).toBeInTheDocument();
    expect(within(dialog).queryByRole('button', { name: /manhwa/i })).not.toBeInTheDocument();
  });

  it('Scénario 7 — choisir "Manhwa" affiche le formulaire SANS champ auteur', async () => {
    const user = userEvent.setup();
    renderInRouter();
    await openAndPick(user, /manhwa/i);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByLabelText(/titre/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/chapitres totaux/i)).toBeInTheDocument();
    expect(within(dialog).queryByLabelText(/auteur/i)).not.toBeInTheDocument();
  });

  it('Scénario 8 — choisir "Manhua" affiche le formulaire SANS champ auteur', async () => {
    const user = userEvent.setup();
    renderInRouter();
    await openAndPick(user, /manhua/i);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByLabelText(/titre/i)).toBeInTheDocument();
    expect(within(dialog).queryByLabelText(/auteur/i)).not.toBeInTheDocument();
  });

  it('Scénario 9 — bouton "Retour" revient au choix du type', async () => {
    const user = userEvent.setup();
    renderInRouter();
    await openAndPick(user, /manga/i);

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /retour/i }));

    expect(within(dialog).getByRole('button', { name: /manhwa/i })).toBeInTheDocument();
    expect(within(dialog).queryByLabelText(/titre/i)).not.toBeInTheDocument();
  });
});

describe('AddWorkMenu — soumission du formulaire', () => {
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

  it('Scénario 10 — soumission manga → POST /addManga + ferme la modale', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderInRouter();
    await openAndPick(user, /manga/i);

    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByLabelText(/titre/i), 'Berserk');
    await user.type(within(dialog).getByLabelText(/auteur/i), 'Kentaro Miura');
    await user.type(within(dialog).getByLabelText(/chapitres totaux/i), '370');
    await user.click(within(dialog).getByRole('button', { name: /^ajouter$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/addManga$/);
    expect(init.method).toBe('POST');
    const body = init.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('titre')).toBe('Berserk');
    expect(body.get('auteur')).toBe('Kentaro Miura');
    expect(body.get('nombreDeChapitres')).toBe('370');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('Scénario 11 — soumission manhwa → POST /addManhwa avec body sans auteur', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderInRouter();
    await openAndPick(user, /manhwa/i);

    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByLabelText(/titre/i), 'Solo Leveling');
    await user.type(within(dialog).getByLabelText(/chapitres totaux/i), '200');
    await user.click(within(dialog).getByRole('button', { name: /^ajouter$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/addManhwa$/);
    const body = init.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('titre')).toBe('Solo Leveling');
    expect(body.get('nombreDeChapitres')).toBe('200');
    expect(body.has('auteur')).toBe(false);
  });

  it('Scénario 12 — titre vide → erreur de validation, pas d\'appel API', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderInRouter();
    await openAndPick(user, /manhua/i);

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /^ajouter$/i }));

    expect(await within(dialog).findByText(/titre.*(requis|obligatoire)/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('Scénario 13bis — sélectionner un fichier image affiche un aperçu', async () => {
    const user = userEvent.setup();
    renderInRouter();
    await openAndPick(user, /manga/i);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).queryByAltText(/aperçu/i)).not.toBeInTheDocument();

    const file = new File(['(binary)'], 'cover.png', { type: 'image/png' });
    const imageInput = within(dialog).getByLabelText(/image.*couverture/i) as HTMLInputElement;
    await user.upload(imageInput, file);

    const preview = await within(dialog).findByAltText(/aperçu/i);
    expect(preview).toHaveAttribute('src', expect.stringMatching(/^blob:/));
  });

  it('Scénario 13ter — submit avec fichier → body inclut le fichier sous "image"', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderInRouter();
    await openAndPick(user, /manga/i);

    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByLabelText(/titre/i), 'Naruto');
    await user.type(within(dialog).getByLabelText(/auteur/i), 'Kishimoto');
    await user.type(within(dialog).getByLabelText(/chapitres totaux/i), '700');

    const file = new File(['hello'], 'naruto.png', { type: 'image/png' });
    await user.upload(within(dialog).getByLabelText(/image.*couverture/i) as HTMLInputElement, file);

    await user.click(within(dialog).getByRole('button', { name: /^ajouter$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, init] = fetchMock.mock.calls[0];
    const body = init.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('titre')).toBe('Naruto');
    const sentImage = body.get('image');
    expect(sentImage).toBeInstanceOf(File);
    expect((sentImage as File).name).toBe('naruto.png');
    expect((sentImage as File).type).toBe('image/png');
  });

  it('Scénario 13quater — submit sans image → body sans champ image', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderInRouter();
    await openAndPick(user, /manhwa/i);

    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByLabelText(/titre/i), 'Solo Leveling');
    await user.type(within(dialog).getByLabelText(/chapitres totaux/i), '200');
    await user.click(within(dialog).getByRole('button', { name: /^ajouter$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, init] = fetchMock.mock.calls[0];
    const body = init.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.has('image')).toBe(false);
  });

  it('Scénario 13 — erreur API → message d\'erreur, modale reste ouverte', async () => {
    const fetchMock = mockFetchError();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderInRouter();
    await openAndPick(user, /manga/i);

    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByLabelText(/titre/i), 'Bleach');
    await user.type(within(dialog).getByLabelText(/auteur/i), 'Tite Kubo');
    await user.type(within(dialog).getByLabelText(/chapitres totaux/i), '700');
    await user.click(within(dialog).getByRole('button', { name: /^ajouter$/i }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(/erreur/i);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
