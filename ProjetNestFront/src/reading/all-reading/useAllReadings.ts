import { useEffect, useState } from 'react';
import type { Manga, Manhwa, Manhua, Reading } from './types';

type Status = 'loading' | 'success' | 'error';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface UseAllReadingsResult {
  status: Status;
  readings: Reading[];
}

async function fetchList<T>(path: string): Promise<T[]> {
  const res = await fetch(`${API_BASE}/${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T[];
}

export function useAllReadings(): UseAllReadingsResult {
  const [status, setStatus] = useState<Status>('loading');
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchList<Omit<Manga, 'kind'>>('getAllManga'),
      fetchList<Omit<Manhwa, 'kind'>>('getAllManhwa'),
      fetchList<Omit<Manhua, 'kind'>>('getAllManhua'),
    ])
      .then(([mangas, manhwas, manhuas]) => {
        if (cancelled) return;
        const merged: Reading[] = [
          ...mangas.map((m) => ({ ...m, kind: 'manga' as const })),
          ...manhwas.map((m) => ({ ...m, kind: 'manhwa' as const })),
          ...manhuas.map((m) => ({ ...m, kind: 'manhua' as const })),
        ];
        setReadings(merged.filter((r) => r.activé));
        setStatus('success');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, readings };
}
