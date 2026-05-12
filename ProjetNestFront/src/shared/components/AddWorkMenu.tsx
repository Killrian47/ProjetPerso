import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { createPortal } from 'react-dom';

type Kind = 'manga' | 'manhwa' | 'manhua';

interface KindMeta {
  label: string;
  description: string;
  badge: string;
  endpoint: string;
  accentText: string;
  accentRing: string;
  accentBorderHover: string;
  accentBg: string;
  accentBgHover: string;
  accentBgText: string;
  hasAuteur: boolean;
}

const KIND_META: Record<Kind, KindMeta> = {
  manga: {
    label: 'Manga',
    description: 'Bande dessinée japonaise',
    badge: '日',
    endpoint: '/addManga',
    accentText: 'text-red-500',
    accentRing: 'focus:border-red-500/60 focus:ring-red-500/20',
    accentBorderHover: 'hover:border-red-500/60 hover:bg-red-500/5',
    accentBg: 'bg-red-600',
    accentBgHover: 'hover:bg-red-500',
    accentBgText: 'text-white',
    hasAuteur: true,
  },
  manhwa: {
    label: 'Manhwa',
    description: 'Bande dessinée coréenne',
    badge: '한',
    endpoint: '/addManhwa',
    accentText: 'text-amber-400',
    accentRing: 'focus:border-amber-500/60 focus:ring-amber-500/20',
    accentBorderHover: 'hover:border-amber-500/60 hover:bg-amber-500/5',
    accentBg: 'bg-amber-500',
    accentBgHover: 'hover:bg-amber-400',
    accentBgText: 'text-slate-950',
    hasAuteur: false,
  },
  manhua: {
    label: 'Manhua',
    description: 'Bande dessinée chinoise',
    badge: '中',
    endpoint: '/addManhua',
    accentText: 'text-emerald-400',
    accentRing: 'focus:border-emerald-500/60 focus:ring-emerald-500/20',
    accentBorderHover: 'hover:border-emerald-500/60 hover:bg-emerald-500/5',
    accentBg: 'bg-emerald-500',
    accentBgHover: 'hover:bg-emerald-400',
    accentBgText: 'text-slate-950',
    hasAuteur: false,
  },
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type SubmitStatus = 'idle' | 'submitting' | 'error';

export function AddWorkMenu() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind | null>(null);

  function close() {
    setOpen(false);
    setKind(null);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ajouter une œuvre"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-500/30 transition hover:bg-red-500 hover:shadow-red-500/50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div
            data-testid="modal-backdrop"
            onClick={close}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-work-title"
                onClick={(e) => e.stopPropagation()}
                className="my-8 w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/60"
              >
                {kind === null ? (
                  <TypeChooser onPick={setKind} onClose={close} />
                ) : (
                  <WorkForm
                    kind={kind}
                    onBack={() => setKind(null)}
                    onClose={close}
                    onSuccess={close}
                  />
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function TypeChooser({ onPick, onClose }: { onPick: (k: Kind) => void; onClose: () => void }) {
  return (
    <>
      <ModalHeader title="Quel type d'œuvre ?" onClose={onClose}>
        Choisis le format que tu veux ajouter à ta bibliothèque.
      </ModalHeader>
      <ul className="mt-6 space-y-3">
        {(Object.keys(KIND_META) as Kind[]).map((k) => {
          const meta = KIND_META[k];
          return (
            <li key={k}>
              <button
                type="button"
                onClick={() => onPick(k)}
                className={`flex w-full items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-left transition-colors ${meta.accentBorderHover}`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-2xl font-bold ${meta.accentText}`}
                  aria-hidden="true"
                >
                  {meta.badge}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-bold uppercase tracking-wider ${meta.accentText}`}>
                    {meta.label}
                  </span>
                  <span className="block text-xs text-slate-400">{meta.description}</span>
                </span>
                <span className="text-slate-600" aria-hidden="true">›</span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

interface WorkFormProps {
  kind: Kind;
  onBack: () => void;
  onClose: () => void;
  onSuccess: () => void;
}

function WorkForm({ kind, onBack, onClose, onSuccess }: WorkFormProps) {
  const meta = KIND_META[kind];

  const [titre, setTitre] = useState('');
  const [auteur, setAuteur] = useState('');
  const [nombreDeChapitres, setNombreDeChapitres] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [auteurError, setAuteurError] = useState<string | null>(null);
  const [chaptersError, setChaptersError] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const inputClass = `mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition focus:outline-none focus:ring-2 ${meta.accentRing}`;

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
    if (meta.hasAuteur && auteur.trim() === '') {
      setAuteurError("L'auteur est requis");
      hasError = true;
    } else {
      setAuteurError(null);
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
      if (meta.hasAuteur) fd.append('auteur', auteur.trim());
      if (imageFile) fd.append('image', imageFile);

      const res = await fetch(`${API_BASE}${meta.endpoint}`, {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onSuccess();
    } catch {
      setStatus('error');
    }
  }

  const isSubmitting = status === 'submitting';

  return (
    <>
      <ModalHeader
        title={`Ajouter un ${meta.label.toLowerCase()}`}
        kicker={meta.label}
        kickerClass={meta.accentText}
        onClose={onClose}
      />

      <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
        <div>
          <label htmlFor="work-title" className="block text-sm font-semibold text-slate-200">
            Titre
          </label>
          <input
            id="work-title"
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className={inputClass}
          />
          {titleError && <p className="mt-1 text-xs text-red-400">{titleError}</p>}
        </div>

        {meta.hasAuteur && (
          <div>
            <label htmlFor="work-auteur" className="block text-sm font-semibold text-slate-200">
              Auteur
            </label>
            <input
              id="work-auteur"
              type="text"
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              className={inputClass}
            />
            {auteurError && <p className="mt-1 text-xs text-red-400">{auteurError}</p>}
          </div>
        )}

        <div>
          <label htmlFor="work-chapters" className="block text-sm font-semibold text-slate-200">
            Chapitres totaux
          </label>
          <input
            id="work-chapters"
            type="number"
            value={nombreDeChapitres}
            onChange={(e) => setNombreDeChapitres(e.target.value)}
            className={inputClass}
          />
          {chaptersError && <p className="mt-1 text-xs text-red-400">{chaptersError}</p>}
        </div>

        <div>
          <label htmlFor="work-image" className="block text-sm font-semibold text-slate-200">
            Image de couverture
            <span className="ml-1 text-xs font-normal text-slate-500">(optionnel)</span>
          </label>
          <input
            id="work-image"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-100 hover:file:bg-slate-600"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Aperçu de la couverture"
              className="mt-3 h-48 w-auto rounded-lg border border-slate-800 object-cover"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800"
          >
            ‹ Retour
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${meta.accentBg} ${meta.accentBgText} ${meta.accentBgHover}`}
          >
            {isSubmitting ? 'Ajout en cours…' : 'Ajouter'}
          </button>
        </div>

        {status === 'error' && (
          <p role="alert" className="rounded border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            Une erreur est survenue. Réessayez.
          </p>
        )}
      </form>
    </>
  );
}

function ModalHeader({
  title,
  kicker = 'Nouvelle entrée',
  kickerClass = 'text-red-500',
  children,
  onClose,
}: {
  title: string;
  kicker?: string;
  kickerClass?: string;
  children?: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className={`text-xs font-bold uppercase tracking-[0.3em] ${kickerClass}`}>{kicker}</p>
        <h2 id="add-work-title" className="mt-1 text-2xl font-black tracking-tight text-white">
          {title}
        </h2>
        {children && <p className="mt-1 text-sm text-slate-400">{children}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
      >
        <span aria-hidden="true" className="text-xl leading-none">×</span>
      </button>
    </div>
  );
}
