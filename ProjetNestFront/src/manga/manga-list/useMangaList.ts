import { useEffect, useState } from 'react';
import type { Manga } from '@/reading/all-reading/types';

type Status = 'loading' | 'success' | 'error';

const ENDPOINT = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000') + '/getAllManga';

export interface UseMangaListResult {
  status: Status;
  mangas: Manga[];
}

export function useMangaList(): UseMangaListResult {
  const [status, setStatus] = useState<Status>('loading');
  const [mangas, setMangas] = useState<Manga[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(ENDPOINT)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as Manga[];
      })
      .then((data) => {
        if (cancelled) return;
        setMangas(data);
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

  return { status, mangas };
}
