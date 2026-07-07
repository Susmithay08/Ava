import React from 'react';
import { Level } from '../lib/status';

const LEVEL_COLOR: Record<Level, string> = {
  good: '#7ff2a8',
  warn: '#ffb020',
  bad: '#ff6b6b',
};

interface Props {
  label: string;
  value: React.ReactNode;
  unit?: string;
  level?: Level;
  icon?: React.ReactNode;
  sub?: React.ReactNode;
  source?: 'LIVE' | 'SIM';
  progress?: number;
}

export default function StatCard({ label, value, unit, level = 'good', icon, sub, source, progress }: Props) {
  const c = LEVEL_COLOR[level];
  return (
    <div className="glass-tight p-4 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <span className="label">{label}</span>
        <div className="flex items-center gap-1.5">
          {source && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{
                color: source === 'LIVE' ? '#7ff2a8' : '#86c8ff',
                background: source === 'LIVE' ? 'rgba(127,242,168,0.12)' : 'rgba(134,200,255,0.12)',
              }}
              title={source === 'LIVE' ? 'Real host telemetry' : 'Physics-modelled value'}
            >
              {source}
            </span>
          )}
          {icon && <span className="text-em-muted">{icon}</span>}
        </div>
      </div>
      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="h-display text-3xl font-bold tabular-nums" style={{ color: c }}>
          {value}
        </span>
        {unit && <span className="text-sm text-em-muted font-medium">{unit}</span>}
      </div>
      {progress != null && (
        <div className="mt-3 h-1.5 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%`, background: c, boxShadow: `0 0 8px ${c}88` }}
          />
        </div>
      )}
      {sub && <div className="mt-2 text-xs text-em-muted">{sub}</div>}
    </div>
  );
}
