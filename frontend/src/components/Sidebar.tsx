import React from 'react';
import { IconDashboard, IconRobot, IconDiagnostics, IconHistory, IconSettings } from './Icons';

export type Page = 'overview' | 'dashboard' | 'robot' | 'diagnostics' | 'history' | 'settings';

const NAV: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <IconDashboard size={20} /> },
  { id: 'dashboard', label: 'Live View', icon: <IconRobot size={20} /> },
  { id: 'robot', label: 'Robots', icon: <IconRobot size={20} /> },
  { id: 'diagnostics', label: 'Analytics', icon: <IconDiagnostics size={20} /> },
  { id: 'history', label: 'Events', icon: <IconHistory size={20} /> },
  { id: 'settings', label: 'Settings', icon: <IconSettings size={20} /> },
];

export default function Sidebar({
  page,
  setPage,
  faultCount,
  health,
}: {
  page: Page;
  setPage: (p: Page) => void;
  faultCount: number;
  health: string;
}) {
  return (
    <nav className="relative z-20 shrink-0 w-56 h-full flex flex-col px-3 py-4 border-r border-white/6">
      {/* brand */}
      <div className="flex items-center gap-2.5 px-2 mb-6">
        <div className="w-11 h-11 rounded-full grid place-items-center border-2 border-em-orange">
          <span className="h-display font-bold text-em-orange text-sm leading-none">TA</span>
        </div>
        <div className="leading-tight">
          <div className="h-display font-bold text-em-ink tracking-wide text-[15px]">TEMPLE ALLEN</div>
          <div className="text-[9px] font-bold tracking-[0.2em] text-em-orange">INDUSTRY. BUILT SOLID.</div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {NAV.map((n) => {
          const active = page === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              className={`btn group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-left ${
                active
                  ? 'bg-em-orange/15 text-em-orange border border-em-orange/30'
                  : 'text-em-muted hover:text-em-ink hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{n.icon}</span>
              <span className="text-sm font-medium">{n.label}</span>
              {n.id === 'diagnostics' && faultCount > 0 && (
                <span className="ml-auto min-w-5 h-5 px-1 rounded-full bg-em-orange text-black text-[10px] font-bold grid place-items-center">
                  {faultCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* system status */}
      <div className="mt-auto glass-tight p-3.5">
        <div className="text-sm font-semibold text-em-ink mb-1">System Status</div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: health === 'fault' ? '#ff5a5a' : health === 'warning' ? '#ffb020' : '#22c55e' }}
          />
          <span className="text-em-muted">
            {health === 'fault' ? 'Fault active' : health === 'warning' ? 'Warnings present' : 'All Systems Operational'}
          </span>
        </div>
      </div>
    </nav>
  );
}
