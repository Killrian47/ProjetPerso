import { useEffect, useState } from 'react';
import type { Manhua } from '@/reading/all-reading/types';

type Status = 'loading' | 'success' | 'error';

const ENDPOINT = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000') + '/getAllManhua';

export interface UseManhuaListResult {
  status: Status;
  manhuas: Manhua[];
}

export function useManhuaList(): UseManhuaListResult {
  const [status, setStatus] = useState<Status>('loading');
  const [manhuas, setManhuas] = useState<Manhua[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(ENDPOINT)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as Manhua[];
      })
      .then((data) => {
        if (cancelled) return;
        setManhuas(data);
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

  return { status, manhuas };
}
