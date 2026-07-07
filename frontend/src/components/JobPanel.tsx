import React from 'react';
import type { Robot } from '../lib/types';
import { useSettings, area, fmtDuration } from '../lib/settings';

export default function JobPanel({ robot }: { robot: Robot }) {
  const { settings } = useSettings();
  const j = robot.job;
  const done = area(j.completedM2, settings.units);
  const total = area(j.surfaceAreaM2, settings.units);
  const pct = j.completionPercent;
  const statusColor =
    robot.status === 'running' ? '#7ff2a8' : robot.status === 'paused' ? '#ffb020' : '#8ea69a';

  return (
    <div className="glass edge-lit p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="h-display text-sm font-bold uppercase tracking-widest text-em-ink">Current Job</h3>
        <span className="chip" style={{ color: statusColor }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
          {robot.status.toUpperCase()}
        </span>
      </div>

      <div className="text-base font-semibold text-em-ink mb-1">{j.name}</div>
      <div className="text-xs text-em-muted mb-4">
        Step {j.stepIndex}/7 · {j.currentStep}
      </div>

      <div className="mb-1 flex justify-between text-xs">
        <span className="text-em-muted">Completion</span>
        <span className="h-display font-bold text-em-mint tabular-nums">{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/8 overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#12b866,#7ff2a8)', boxShadow: '0 0 10px rgba(53,225,127,0.6)' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="Surface" value={`${done.value} / ${total.value}`} unit={total.unit} />
        <Stat label="Time Left" value={fmtDuration(j.etaSeconds)} />
        <Stat label="Position" value={`X ${robot.position.x.toFixed(1)} Y ${robot.position.y.toFixed(1)}`} unit="m" />
        <Stat label="Speed" value={`${robot.actualSpeed}`} unit="%" />
      </div>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="glass-tight p-3">
      <div className="label mb-1">{label}</div>
      <div className="text-sm font-semibold text-em-ink tabular-nums">
        {value} {unit && <span className="text-em-muted text-xs">{unit}</span>}
      </div>
    </div>
  );
}
