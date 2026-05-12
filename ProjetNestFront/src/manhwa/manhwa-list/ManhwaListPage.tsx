import { useCallback, useMemo, useState } from 'react';
import { ManhwaProgressCard } from '@/manhwa/update-chapters/ManhwaProgressCard';
import { useManhwaList } from './useManhwaList';

export function ManhwaListPage() {
  const { status, manhwas } = useManhwaList();
  const [query, setQuery] = useState('');
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const handleDeactivated = useCallback((id: string) => {
    setRemovedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const visible = useMemo(
    () => manhwas.filter((m) => !removedIds.has(m.id)),
    [manhwas, removedIds],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === '') return visible;
    return visible.filter((m) => m.titre.toLowerCase().includes(q));
  }, [visible, query]);

  if (status === 'loading') {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <div role="status" aria-label="Chargement" className="text-slate-400">
          Chargement…
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <div role="alert" className="rounded border border-red-500/30 bg-red-950/40 p-4 text-red-300">
          Une erreur est survenue lors du chargement des manhwas.
        </div>
      </main>
    );
  }

  if (manhwas.length === 0) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <h1 className="mb-4 text-2xl font-black tracking-tight">Mes manhwas</h1>
        <p className="text-slate-400">Aucun manhwa dans votre bibliothèque.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Catalogue</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Mes manhwas</h1>
        </div>
        <label htmlFor="manhwa-search" className="sr-only">
          Rechercher un manhwa
        </label>
        <input
          id="manhwa-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un manhwa…"
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 transition focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 sm:max-w-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-400">Aucun résultat pour « {query} ».</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((m) => (
            <ManhwaProgressCard key={m.id} manhwa={m} onDeactivated={handleDeactivated} />
          ))}
        </ul>
      )}
    </main>
  );
}
