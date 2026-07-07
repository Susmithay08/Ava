import React from 'react';
import type { Fault } from '../lib/types';
import { ackFault, resetFaults } from '../lib/useTelemetry';
import { fmtTime } from '../lib/settings';
import { IconWarning, IconReset } from './Icons';

const SEV: Record<string, { color: string; label: string }> = {
  critical: { color: '#ff6b6b', label: 'CRITICAL' },
  warning: { color: '#ffb020', label: 'WARNING' },
  info: { color: '#86c8ff', label: 'INFO' },
};

export default function FaultPanel({ faults }: { faults: Fault[] }) {
  return (
    <div className="glass edge-lit p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 h-display text-sm font-bold uppercase tracking-widest text-em-ink">
          <IconWarning size={16} className="text-em-amber" /> Active Faults
          {faults.length > 0 && (
            <span className="bg-em-orange text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{faults.length}</span>
          )}
        </h3>
        {faults.length > 0 && (
          <button onClick={() => resetFaults()} className="btn chip !text-em-amber gap-1.5">
            <IconReset size={13} /> Reset all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[100px]">
        {faults.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-em-muted py-8">
            <div className="w-12 h-12 rounded-full bg-em-lime/10 grid place-items-center mb-2">
              <span className="text-em-mint text-xl">✓</span>
            </div>
            <span className="text-sm">All systems nominal</span>
          </div>
        ) : (
          faults.map((f) => {
            const s = SEV[f.severity] || SEV.info;
            return (
              <div key={f.id} className="glass-tight p-3" style={{ borderColor: `${s.color}44` }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: s.color, background: `${s.color}22` }}>
                      {s.label}
                    </span>
                    <span className="font-semibold text-sm text-em-ink">{f.title}</span>
                  </div>
                  <span className="text-[10px] text-em-muted font-mono whitespace-nowrap">{fmtTime(f.timestamp)}</span>
                </div>
                <p className="text-xs text-em-muted mt-1.5">{f.description}</p>
                <p className="text-xs text-em-ink/80 mt-1.5">
                  <span className="text-em-muted">↳ </span>
                  {f.action}
                </p>
                <div className="mt-2.5">
                  {f.acknowledged ? (
                    <span className="text-[11px] text-em-mint">✓ Acknowledged</span>
                  ) : (
                    <button
                      onClick={() => ackFault(f.id)}
                      className="btn text-xs px-3 py-1.5 rounded-lg"
                      style={{ color: s.color, background: `${s.color}1a`, border: `1px solid ${s.color}44` }}
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
