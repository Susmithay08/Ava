import React from 'react';

interface Props {
  value: number; // 0-100 fill
  label: string;
  display: string;
  unit?: string;
  color?: string;
  track?: number; // optional secondary "planned" marker 0-100
  size?: number;
}

// 270° arc gauge, mint by default — matches the ref completion gauges.
export default function RadialGauge({
  value,
  label,
  display,
  unit,
  color = '#7ff2a8',
  track,
  size = 128,
}: Props) {
  const stroke = 9;
  const r = (size - stroke * 2) / 2;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const arc = 0.75; // 270 degrees
  const pct = Math.max(0, Math.min(100, value));
  const dash = circ * arc;
  const offset = dash * (1 - pct / 100);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[135deg]">
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="rgba(127,242,168,0.1)"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.2,0.7,0.2,1)', filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
        {track != null && (
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke="#ff7a1a"
            strokeWidth={stroke}
            strokeDasharray={`2 ${circ}`}
            strokeDashoffset={dash * (1 - Math.min(100, track) / 100)}
            strokeLinecap="round"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="h-display text-2xl font-bold tabular-nums" style={{ color }}>
          {display}
          {unit && <span className="text-sm text-em-muted ml-0.5">{unit}</span>}
        </span>
        <span className="label mt-0.5">{label}</span>
      </div>
    </div>
  );
}
