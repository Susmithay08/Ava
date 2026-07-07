import React, { useEffect, useState } from 'react';
import type { Robot } from '../lib/types';

const HEALTH_COLOR: Record<string, string> = {
  healthy: '#7ff2a8',
  warning: '#ffb020',
  fault: '#ff6b6b',
};

// Timeline strip like ref1 — a 1-hour window with the "live" range lit green.
function Timeline() {
  const now = new Date();
  const slots = Array.from({ length: 13 }, (_, i) => {
    const d = new Date(now.getTime() - (12 - i) * 5 * 60000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  });
  return (
    <div className="hidden lg:flex items-center gap-0 flex-1 max-w-3xl mx-4">
      <div className="relative flex-1 h-9 rounded-xl overflow-hidden glass-tight flex items-center">
        {/* lit "active" range */}
        <div className="absolute inset-y-1 left-[54%] right-[16%] rounded-lg bg-em-lime/15 border border-em-lime/30" />
        <div className="relative flex justify-between w-full px-3 font-mono text-[10px] text-em-muted">
          {slots.map((s, i) => (
            <span key={i} className={i >= 7 && i <= 10 ? 'text-em-mint' : ''}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TopBar({
  robot,
  conn,
  latency,
  operator,
  healthScore,
}: {
  robot: Robot | null;
  conn: string;
  latency: number;
  operator: string;
  healthScore: number;
}) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hc = HEALTH_COLOR[robot?.health || 'healthy'];
  const bars = conn !== 'online' ? 0 : latency < 60 ? 4 : latency < 130 ? 3 : latency < 250 ? 2 : 1;

  return (
    <header className="relative z-20 h-16 shrink-0 flex items-center px-4 gap-3">
      {/* brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl grid place-items-center bg-em-lime/15 border border-em-lime/30 shadow-glow">
          <span className="h-display font-bold text-em-mint text-lg">◤</span>
        </div>
        <div className="leading-tight">
          <div className="h-display font-bold text-em-ink tracking-wide">EMMA</div>
          <div className="label">Operator Console</div>
        </div>
      </div>

      {/* zone selector */}
      <div className="hidden md:flex chip !rounded-xl !py-1.5 ml-1">
        <span className="text-em-muted">Zone</span>
        <span className="text-em-ink font-semibold">Cell&nbsp;T-2</span>
      </div>

      <Timeline />

      {/* right cluster */}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 chip !rounded-xl !py-1.5">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: hc }} />
          <span className="font-semibold" style={{ color: hc }}>
            {(robot?.status || 'idle').toUpperCase()}
          </span>
        </div>

        {/* connection quality */}
        <div className="flex items-end gap-0.5 h-4" title={`${latency}ms`}>
          {[1, 2, 3, 4].map((b) => (
            <span
              key={b}
              className="w-1 rounded-sm"
              style={{ height: `${b * 25}%`, background: b <= bars ? '#7ff2a8' : 'rgba(127,242,168,0.2)' }}
            />
          ))}
        </div>

        {/* operator + clock */}
        <div className="flex items-center gap-2 pl-3 border-l border-em-mint/10">
          <div className="w-9 h-9 rounded-full grid place-items-center bg-em-panel border border-em-mint/20 text-em-mint text-xs font-bold">
            {operator.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden lg:block leading-tight">
            <div className="text-xs font-semibold text-em-ink">{operator}</div>
            <div className="font-mono text-[10px] text-em-muted tabular-nums">
              {time.toLocaleTimeString([], { hour12: false })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
