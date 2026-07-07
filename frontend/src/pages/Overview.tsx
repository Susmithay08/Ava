import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { Telemetry } from '../lib/types';
import RadialGauge from '../components/RadialGauge';
import { generateReport } from '../lib/report';
import { fmtTime, useSettings } from '../lib/settings';

interface FleetSummary {
  total: number;
  active: number;
  idle: number;
  alerts: number;
  totalOutput: number;
  targetOutput: number;
  efficiency: number;
  robots: { id: string; cell: string; task: string; status: string; health: string; completion: number }[];
  history: { t: number; actual: number; target: number }[];
}

const STATUS_COLOR: Record<string, string> = {
  running: '#22c55e',
  idle: '#ffb020',
  alert: '#ff5a5a',
  maintenance: '#7cc4ff',
};

const FEED = [
  { label: 'Cell 01 · Welding', dot: '#22c55e' },
  { label: 'Cell 02 · Handling', dot: '#22c55e' },
  { label: 'Cell 03 · Assembly', dot: '#22c55e' },
  { label: 'Cell 04 · Machine Tending', dot: '#ff5a5a' },
];

export default function Overview({ tel, latency }: { tel: Telemetry; latency: number }) {
  const { settings } = useSettings();
  const [fleet, setFleet] = useState<FleetSummary | null>(null);
  const [subs, setSubs] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    const load = () => {
      fetch('/api/fleet').then((r) => r.json()).then((d) => alive && setFleet(d)).catch(() => {});
      fetch('/api/diagnostics').then((r) => r.json()).then((d) => alive && setSubs(d.subsystems || {})).catch(() => {});
    };
    load();
    const t = setInterval(load, 1500);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const chart = (fleet?.history || []).map((h) => ({ ...h, time: fmtTime(h.t).slice(0, 5) }));
  const alarms = tel.robot.faults.slice(0, 4);

  return (
    <div className="h-full overflow-y-auto pr-1 pb-2">
      {/* page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="h-display text-2xl font-bold text-em-ink">Overview</h1>
          <p className="text-sm text-em-muted">Real-time overview of all robotic systems</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="chip !rounded-xl !py-2">Last 1 Hour</span>
          <button
            onClick={() => generateReport(tel, latency, settings.operatorName)}
            className="btn text-white font-semibold px-4 py-2.5 text-sm shadow-glowOrange flex items-center gap-2"
            style={{ background: 'linear-gradient(90deg,#ff8a1a,#ff5a00)' }}
          >
            ⬇ Export
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Kpi label="Total Robots" value={fleet?.total ?? '—'} sub="All systems" />
        <Kpi label="Active" value={fleet?.active ?? '—'} sub={fleet ? `${Math.round((fleet.active / fleet.total) * 100)}%` : ''} ring={fleet ? (fleet.active / fleet.total) * 100 : 0} ringColor="#ff6a1a" />
        <Kpi label="Idle" value={fleet?.idle ?? '—'} sub={fleet ? `${Math.round((fleet.idle / fleet.total) * 100)}%` : ''} ring={fleet ? (fleet.idle / fleet.total) * 100 : 0} ringColor="#ffb020" />
        <Kpi label="Alerts" value={fleet?.alerts ?? '—'} sub="View all" alert />
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Production */}
        <div className="col-span-12 xl:col-span-7 glass edge-lit p-5">
          <h3 className="h-display font-bold text-em-ink mb-4">Production Overview</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="flex items-center gap-4 text-[11px] text-em-muted mb-1">
                <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 border-t border-dashed border-em-muted" /> Target</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-em-orange" /> Actual</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chart} margin={{ left: -18, right: 6, top: 6 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: '#8b909a', fontSize: 10 }} minTickGap={30} />
                  <YAxis tick={{ fill: '#8b909a', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#15171b', border: '1px solid #2a2d33', borderRadius: 10, fontSize: 12 }} />
                  <Line type="monotone" dataKey="target" stroke="#8b909a" strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="actual" stroke="#ff6a1a" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <Metric label="Total Output" value={fleet ? fleet.totalOutput.toLocaleString() : '—'} unit="pcs" />
              <Metric label="Target Output" value={fleet ? fleet.targetOutput.toLocaleString() : '—'} unit="pcs" />
              <Metric label="Efficiency" value={fleet ? `${fleet.efficiency}%` : '—'} accent />
            </div>
          </div>
        </div>

        {/* Live feed */}
        <div className="col-span-12 xl:col-span-5 glass edge-lit p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="h-display font-bold text-em-ink">Live Feed</h3>
            <span className="text-xs text-em-orange">View all</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FEED.map((f) => (
              <div key={f.label} className="relative rounded-xl overflow-hidden h-28 border border-white/8 group">
                <img src="/emma-real.webp" alt="" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: f.dot, boxShadow: `0 0 6px ${f.dot}` }} />
                  <span className="text-[11px] font-semibold text-white">{f.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* bottom row */}
      <div className="grid grid-cols-12 gap-4">
        {/* robots status */}
        <div className="col-span-12 lg:col-span-5 glass edge-lit p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="h-display font-bold text-em-ink">Robots Status</h3>
            <span className="text-xs text-em-orange">View all</span>
          </div>
          <div className="space-y-1">
            {(fleet?.robots || []).slice(0, 6).map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="w-8 h-8 rounded-lg grid place-items-center text-em-orange" style={{ background: 'rgba(255,106,26,0.1)' }}>⛭</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-em-ink">{r.id}</div>
                  <div className="text-[11px] text-em-muted truncate">{r.cell}</div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: STATUS_COLOR[r.status] }}>
                  {r.status}
                </span>
                <span className="text-sm font-mono tabular-nums text-em-ink w-10 text-right">{r.completion}%</span>
                <span className="w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: STATUS_COLOR[r.status] }} />
              </div>
            ))}
          </div>
        </div>

        {/* system health */}
        <div className="col-span-12 lg:col-span-4 glass edge-lit p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="h-display font-bold text-em-ink">System Health</h3>
            <span className="text-xs text-em-orange">View all</span>
          </div>
          <div className="space-y-1">
            {[
              ['Controllers', subs.comms === 'fault' ? '23 / 24 Online' : '24 / 24 Online', subs.comms || 'ok'],
              ['Network', 'Healthy', 'ok'],
              ['Safety Systems', 'Healthy', 'ok'],
              ['Vision Systems', subs.vision === 'fault' ? 'Offline' : '1 Warning', subs.vision === 'fault' ? 'fault' : 'warning'],
              ['Power Systems', subs.battery === 'warning' ? 'Low Battery' : 'Healthy', subs.battery || 'ok'],
            ].map(([label, val, st]) => {
              const c = st === 'fault' ? '#ff5a5a' : st === 'warning' ? '#ffb020' : '#22c55e';
              return (
                <div key={label} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                  <span className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: `${c}1a`, color: c }}>◉</span>
                  <span className="flex-1 text-sm text-em-ink">{label}</span>
                  <span className="text-xs font-medium" style={{ color: c }}>{val}</span>
                  <span style={{ color: c }}>{st === 'ok' ? '✓' : st === 'warning' ? '⚠' : '✕'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* alarms */}
        <div className="col-span-12 lg:col-span-3 glass edge-lit p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="h-display font-bold text-em-ink">Alarms</h3>
            <span className="text-xs text-em-orange">View all</span>
          </div>
          <div className="space-y-3">
            {alarms.length === 0 ? (
              <div className="text-sm text-em-muted py-4 text-center">No active alarms</div>
            ) : (
              alarms.map((a) => {
                const c = a.severity === 'critical' ? '#ff5a5a' : '#ffb020';
                return (
                  <div key={a.id} className="flex gap-2.5">
                    <span style={{ color: c }} className="mt-0.5">⚠</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-em-ink truncate">{a.title}</div>
                      <div className="text-[11px] text-em-muted truncate">{a.description}</div>
                    </div>
                    <span className="text-[10px] text-em-muted whitespace-nowrap">{fmtTime(a.timestamp)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, ring, ringColor, alert }: { label: string; value: React.ReactNode; sub?: string; ring?: number; ringColor?: string; alert?: boolean }) {
  return (
    <div className="glass edge-lit p-5 flex items-center justify-between">
      <div>
        <div className={`label ${alert ? '!text-em-orange' : ''}`}>{label}</div>
        <div className="h-display text-4xl font-bold text-em-ink mt-1 tabular-nums">{value}</div>
        <div className={`text-xs mt-1 ${alert ? 'text-em-orange' : 'text-em-muted'}`}>{sub}</div>
      </div>
      {ring != null ? (
        <RadialGauge value={ring} display="" label="" color={ringColor} size={64} />
      ) : alert ? (
        <span className="w-12 h-12 rounded-xl grid place-items-center text-em-orange text-2xl" style={{ background: 'rgba(255,106,26,0.12)' }}>⚠</span>
      ) : (
        <span className="w-12 h-12 rounded-xl grid place-items-center text-em-orange text-2xl" style={{ background: 'rgba(255,106,26,0.12)' }}>⛭</span>
      )}
    </div>
  );
}

function Metric({ label, value, unit, accent }: { label: string; value: string; unit?: string; accent?: boolean }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className={`h-display text-xl font-bold mt-0.5 ${accent ? 'text-em-orange' : 'text-em-ink'}`}>
        {value} {unit && <span className="text-xs text-em-muted font-normal">{unit}</span>}
      </div>
    </div>
  );
}
