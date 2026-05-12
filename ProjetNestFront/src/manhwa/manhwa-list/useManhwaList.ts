import { useEffect, useState } from 'react';
import type { Manhwa } from '@/reading/all-reading/types';

type Status = 'loading' | 'success' | 'error';

const ENDPOINT = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000') + '/getAllManhwa';

export interface UseManhwaListResult {
  status: Status;
  manhwas: Manhwa[];
}

export function useManhwaList(): UseManhwaListResult {
  const [status, setStatus] = useState<Status>('loading');
  const [manhwas, setManhwas] = useState<Manhwa[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(ENDPOINT)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as Manhwa[];
      })
      .then((data) => {
        if (cancelled) return;
        setManhwas(data);
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

  return { status, manhwas };
}
