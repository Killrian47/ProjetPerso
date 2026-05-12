import { useCallback, useMemo, useState } from 'react';
import { MangaProgressCard } from '@/manga/update-chapters/MangaProgressCard';
import { ManhwaProgressCard } from '@/manhwa/update-chapters/ManhwaProgressCard';
import { ManhuaProgressCard } from '@/manhua/update-chapters/ManhuaProgressCard';
import { useAllReadings } from './useAllReadings';

export function AllReadingPage() {
  const { status, readings } = useAllReadings();
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const handleDeactivated = useCallback((id: string) => {
    setRemovedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const visible = useMemo(
    () => readings.filter((r) => !removedIds.has(r.id)),
    [readings, removedIds],
  );

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
          Une erreur est survenue lors du chargement de vos lectures.
        </div>
      </main>
    );
  }

  if (visible.length === 0) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="text-slate-400">Aucune lecture en cours</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Dashboard</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Mes lectures</h1>
        <p className="mt-2 text-sm text-slate-400">
          {visible.length} œuvre{visible.length > 1 ? 's' : ''} en cours
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visible.map((r) => {
          if (r.kind === 'manga') {
            return <MangaProgressCard key={r.id} manga={r} onDeactivated={handleDeactivated} />;
          }
          if (r.kind === 'manhwa') {
            return <ManhwaProgressCard key={r.id} manhwa={r} onDeactivated={handleDeactivated} />;
          }
          return <ManhuaProgressCard key={r.id} manhua={r} onDeactivated={handleDeactivated} />;
        })}
      </ul>
    </main>
  );
}
