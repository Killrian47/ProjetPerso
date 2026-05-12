import { useState, type FormEvent, type ChangeEvent } from 'react';

const ENDPOINT = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000') + '/addManhwa';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20';

export function AddManhwaPage() {
  const [titre, setTitre] = useState('');
  const [nombreDeChapitres, setNombreDeChapitres] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [chaptersError, setChaptersError] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>('idle');

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let hasError = false;
    if (titre.trim() === '') {
      setTitleError('Le titre est requis');
      hasError = true;
    } else {
      setTitleError(null);
    }
    const chaptersNum = Number(nombreDeChapitres) || 0;
    if (chaptersNum < 0) {
      setChaptersError('Le nombre de chapitres doit être ≥ 0');
      hasError = true;
    } else {
      setChaptersError(null);
    }
    if (hasError) return;

    setStatus('submitting');

    try {
      const fd = new FormData();
      fd.append('titre', titre.trim());
      fd.append('nombreDeChapitres', String(chaptersNum));
      if (imageFile) fd.append('image', imageFile);

      const res = await fetch(ENDPOINT, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      setTitre('');
      setNombreDeChapitres('');
      setImageFile(null);
      setPreviewUrl(null);
    } catch {
      setStatus('error');
    }
  }

  const isSubmitting = status === 'submitting';

  return (
    <main className="mx-auto max-w-xl p-6">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Bibliothèque</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Ajouter un manhwa</h1>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/40"
        noValidate
      >
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-200">
            Titre
          </label>
          <input
            id="title"
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className={inputClass}
          />
          {titleError && <p className="mt-1 text-xs text-red-400">{titleError}</p>}
        </div>

        <div>
          <label htmlFor="chaptersTotal" className="block text-sm font-semibold text-slate-200">
            Chapitres totaux
          </label>
          <input
            id="chaptersTotal"
            type="number"
            value={nombreDeChapitres}
            onChange={(e) => setNombreDeChapitres(e.target.value)}
            className={inputClass}
          />
          {chaptersError && <p className="mt-1 text-xs text-red-400">{chaptersError}</p>}
        </div>

        <div>
          <label htmlFor="cover" className="block text-sm font-semibold text-slate-200">
            Image de couverture
          </label>
          <input
            id="cover"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-950 hover:file:bg-amber-400"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Aperçu de la couverture"
              className="mt-3 h-48 w-auto rounded-lg border border-slate-800 object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-slate-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Ajout en cours…' : 'Ajouter'}
        </button>

        {status === 'success' && (
          <p role="status" className="rounded border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
            Manhwa ajouté avec succès
          </p>
        )}
        {status === 'error' && (
          <p role="alert" className="rounded border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            Une erreur est survenue. Réessayez.
          </p>
        )}
      </form>
    </main>
  );
}
