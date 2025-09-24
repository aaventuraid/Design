'use client';
import { useEffect, useState } from 'react';

type Health = {
  ok: boolean;
  version: string;
  hasGeminiKey: boolean;
  defaultAIProvider: 'gemini' | 'local';
  serverTime: string;
  uptimeSec: number;
};

export default function StatusIndicator() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const r = await fetch('/api/health');
        const j = await r.json();
        if (active) setHealth(j);
      } catch {
        if (active) setHealth(null);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const statusColor = health?.ok
    ? health.hasGeminiKey
      ? 'bg-green-400'
      : 'bg-yellow-400'
    : 'bg-red-400';
  const label = health?.ok
    ? health.hasGeminiKey
      ? 'Sistem Aktif (Gemini)'
      : 'Sistem Aktif (Local)'
    : 'Sistem Offline';

  return (
    <span className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`}></span>
      <span className="text-xs text-neutral-gray">{label}</span>
    </span>
  );
}
