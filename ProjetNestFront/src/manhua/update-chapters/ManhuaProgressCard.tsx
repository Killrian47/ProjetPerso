import { useState } from 'react';
import type { Manhua } from '@/reading/all-reading/types';
import { ProgressBar } from '@/shared/components/ProgressBar';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface ManhuaProgressCardProps {
  manhua: Manhua;
  onDeactivated?: (id: string) => void;
}

export function ManhuaProgressCard({ manhua, onDeactivated }: ManhuaProgressCardProps) {
  const [read, setRead] = useState(manhua.nombreDeChapitresLus);
  const [total, setTotal] = useState(manhua.nombreDeChapitres);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [disabling, setDisabling] = useState(false);

  const isInactive = manhua.activé === false;

  async function incrementRead() {
    if (read >= total) {
      setError('Tous les chapitres ont déjà été lus');
      return;
    }
    const prev = read;
    setRead(prev + 1);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/manhua/${manhua.id}/addReadChapters`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 1 }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setRead(prev);
      setError('Une erreur est survenue, merci de réessayer.');
    }
  }

  async function incrementTotal() {
    const prev = total;
    setTotal(prev + 1);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/manhua/${manhua.id}/addChapters`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 1 }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setTotal(prev);
      setError('Une erreur est survenue, merci de réessayer.');
    }
  }

  async function confirmDisable() {
    setDisabling(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/disableManhua/${manhua.id}`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setConfirming(false);
      onDeactivated?.(manhua.id);
    } catch {
      setError('Une erreur est survenue, merci de réessayer.');
    } finally {
      setDisabling(false);
    }
  }

  return (
    <li
      className={`group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-md shadow-black/40 ${
        isInactive ? '' : 'transition hover:border-emerald-500/50 hover:shadow-emerald-500/10'
      }`}
    >
      <div className={isInactive ? 'opacity-40 grayscale' : ''}>
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
          {manhua.imageUrl ? (
            <img
              src={manhua.imageUrl}
              alt={`Couverture de ${manhua.titre}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl text-slate-700">
              📖
            </div>
          )}
          <span className="absolute left-2 top-2 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-950 shadow">
            Manhua
          </span>
        </div>

        <div className="p-4">
          <h2 className="line-clamp-2 text-base font-bold leading-tight text-white" title={manhua.titre}>
            {manhua.titre}
          </h2>

          <ProgressBar read={read} total={total} />

          {!isInactive && (
            <>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={incrementRead}
                  className="rounded bg-red-600 px-2 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-500"
                >
                  +1 lu
                </button>
                <button
                  type="button"
                  onClick={incrementTotal}
                  className="rounded bg-slate-800 px-2 py-1.5 text-xs font-semibold text-slate-100 transition-colors hover:bg-slate-700"
                >
                  +1 chapitre
                </button>
              </div>

              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="mt-2 w-full rounded border border-slate-800 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 transition-colors hover:border-red-500/50 hover:text-red-400"
              >
                Désactiver
              </button>

              {confirming && (
                <div className="mt-3 rounded border border-red-500/30 bg-red-950/40 p-3">
                  <p className="text-xs text-red-200">
                    Confirmer la désactivation de « {manhua.titre} » ?
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={confirmDisable}
                      disabled={disabling}
                      className="rounded bg-red-600 px-2 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-50"
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(false)}
                      disabled={disabling}
                      className="rounded bg-slate-800 px-2 py-1.5 text-xs font-semibold text-slate-100 transition-colors hover:bg-slate-700 disabled:opacity-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <p role="alert" className="mt-2 text-xs text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>

      {isInactive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="-rotate-[20deg] select-none border-4 border-red-600 bg-slate-950/70 px-6 py-2 text-2xl font-black uppercase tracking-[0.3em] text-red-500 shadow-2xl">
            Désactivé
          </span>
        </div>
      )}
    </li>
  );
}
