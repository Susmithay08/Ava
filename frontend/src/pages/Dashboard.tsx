import React, { useState } from 'react';
import type { Telemetry } from '../lib/types';
import RobotScene from '../components/RobotScene';
import RadialGauge from '../components/RadialGauge';
import ControlPanel from '../components/ControlPanel';
import StatsDrawer from '../components/StatsDrawer';
import { useSettings, temp, fmtDuration } from '../lib/settings';
import { describeActivity } from '../lib/describe';
import { batteryLevel, loadLevel } from '../lib/status';
import { IconBattery, IconChip, IconWarning } from '../components/Icons';

const LEVEL_COLOR = { good: '#7ff2a8', warn: '#ffb020', bad: '#ff6b6b' } as const;

export default function Dashboard({ tel, latency, conn }: { tel: Telemetry; latency: number; conn: string }) {
  const { settings } = useSettings();
  const [statsOpen, setStatsOpen] = useState(false);
  const r = tel.robot;
  const act = describeActivity(r);
  const tp = temp(r.motorTempC, settings.units);
  const healthColor = r.health === 'fault' ? '#ff6b6b' : r.health === 'warning' ? '#ffb020' : '#7ff2a8';

  return (
    <div className="relative h-full w-full">
      {/* 3D hero fills the whole area */}
      <div className="absolute inset-0">
        <RobotScene robot={r} animationSpeed={settings.animationSpeed} />
      </div>

      {/* floating glass overlay */}
      <div className="absolute inset-0 p-4 grid grid-cols-12 grid-rows-6 gap-4 pointer-events-none">
        {/* Top-left: live overview list */}
        <div className="col-span-12 sm:col-span-4 xl:col-span-3 row-span-3 pointer-events-auto animate-riseIn">
          <div className="glass edge-lit p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="h-display text-sm font-bold uppercase tracking-widest text-em-ink">Live Overview</h3>
              <span className="chip !text-em-mint">● {conn === 'online' ? 'online' : 'offline'}</span>
            </div>
            <div className="space-y-2">
              <Row icon={<IconChip size={16} />} label="Robot uptime" value={fmtDuration(r.uptimeSec)} tag="LIVE" />
              <Row icon={<IconBattery size={16} />} label="Battery" value={`${r.battery.toFixed(0)}%`} tag="SIM" color={LEVEL_COLOR[batteryLevel(r.battery)]} />
              <Row icon={<span className="text-xs">🌡</span>} label="Motor temp" value={`${tp.value}${tp.unit}`} tag="SIM" />
              <Row icon={<IconWarning size={16} />} label="Active faults" value={String(r.faults.length)} color={r.faults.length ? '#ff6b6b' : '#7ff2a8'} />
            </div>
          </div>
        </div>

        {/* spacer center (3D shows through) */}
        <div className="hidden sm:block sm:col-span-4 xl:col-span-6 row-span-4" />

        {/* Right: control dock */}
        <div className="col-span-12 sm:col-span-4 xl:col-span-3 row-span-5 pointer-events-auto self-start animate-riseIn">
          <ControlPanel robot={r} compact />
        </div>

        {/* Bottom-left: gauges */}
        <div className="col-span-12 sm:col-span-8 xl:col-span-6 row-span-2 self-end pointer-events-auto animate-riseIn">
          <div className="glass edge-lit p-3 flex items-center justify-around gap-2">
            <RadialGauge value={r.job.completionPercent} display={r.job.completionPercent.toFixed(0)} unit="%" label="Completion" color="#7ff2a8" track={100} size={112} />
            <RadialGauge value={r.battery} display={r.battery.toFixed(0)} unit="%" label="Battery" color={LEVEL_COLOR[batteryLevel(r.battery)]} size={112} />
            <RadialGauge value={r.motorLoadPercent} display={String(r.motorLoadPercent)} unit="%" label="Motor Load" color={LEVEL_COLOR[loadLevel(r.motorLoadPercent)]} size={112} />
          </div>
        </div>
      </div>

      {/* Bottom-center caption — what EMMA is doing, in plain words */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(680px,92vw)] pointer-events-auto animate-riseIn">
        <div className="glass edge-lit px-5 py-3.5 flex items-center gap-4">
          <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ background: healthColor, boxShadow: `0 0 12px ${healthColor}` }} />
          <div className="min-w-0 flex-1">
            <div className="h-display font-semibold text-em-ink truncate">{act.headline}</div>
            <div className="text-xs text-em-muted truncate">{act.detail}</div>
          </div>
          <button
            onClick={() => setStatsOpen(true)}
            className="btn shrink-0 bg-em-lime/85 hover:bg-em-lime text-black font-semibold px-4 py-2.5 text-sm shadow-glow"
          >
            View all stats →
          </button>
        </div>
      </div>

      <StatsDrawer tel={tel} latency={latency} conn={conn} open={statsOpen} onClose={() => setStatsOpen(false)} />
    </div>
  );
}

function Row({ icon, label, value, tag, color }: { icon: React.ReactNode; label: string; value: string; tag?: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 glass-tight px-3 py-2.5">
      <span className="w-8 h-8 rounded-lg grid place-items-center bg-em-lime/10 text-em-mint">{icon}</span>
      <span className="text-sm text-em-muted flex-1">{label}</span>
      {tag && (
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded"
          style={{ color: tag === 'LIVE' ? '#7ff2a8' : '#86c8ff', background: tag === 'LIVE' ? 'rgba(127,242,168,0.12)' : 'rgba(134,200,255,0.12)' }}
        >
          {tag}
        </span>
      )}
      <span className="h-display font-bold tabular-nums" style={{ color: color || '#e8f0ea' }}>
        {value}
      </span>
    </div>
  );
}
