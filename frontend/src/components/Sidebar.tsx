import React from 'react';
import { IconDashboard, IconRobot, IconDiagnostics, IconHistory, IconSettings } from './Icons';

export type Page = 'dashboard' | 'robot' | 'diagnostics' | 'history' | 'settings';

const NAV: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Overview', icon: <IconDashboard /> },
  { id: 'robot', label: 'Robot', icon: <IconRobot /> },
  { id: 'diagnostics', label: 'Health', icon: <IconDiagnostics /> },
  { id: 'history', label: 'Events', icon: <IconHistory /> },
  { id: 'settings', label: 'Setup', icon: <IconSettings /> },
];

export default function Sidebar({
  page,
  setPage,
  faultCount,
}: {
  page: Page;
  setPage: (p: Page) => void;
  faultCount: number;
}) {
  return (
    <nav className="relative z-20 shrink-0 pl-4 py-2 flex flex-col justify-center">
      <div className="glass p-2 flex flex-col gap-1.5">
        {NAV.map((n) => {
          const active = page === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              title={n.label}
              className={`btn group relative w-14 h-14 grid place-items-center rounded-2xl transition-all ${
                active
                  ? 'bg-em-lime/18 text-em-mint shadow-glow'
                  : 'text-em-muted hover:text-em-ink hover:bg-white/5'
              }`}
            >
              <span className="relative">
                {n.icon}
                {n.id === 'diagnostics' && faultCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-em-orange text-black text-[9px] font-bold grid place-items-center">
                    {faultCount}
                  </span>
                )}
              </span>
              {/* hover label */}
              <span className="pointer-events-none absolute left-16 whitespace-nowrap chip opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                {n.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
