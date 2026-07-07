import React, { useState } from 'react';

export default function Login({ onLogin }: { onLogin: (operator: string) => void }) {
  const [name, setName] = useState('A. Operator');
  const [id, setId] = useState('OP-4471');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operator: name }),
      });
    } catch {
      /* backend optional at login */
    }
    setTimeout(() => onLogin(name), 450);
  };

  return (
    <div className="atmosphere h-full w-full grid place-items-center relative overflow-hidden grid-floor">
      <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
        <div className="h-40 w-full bg-gradient-to-b from-transparent via-em-lime/20 to-transparent animate-scan" />
      </div>

      <form onSubmit={submit} className="relative z-10 glass edge-lit p-8 w-[400px] max-w-[90vw] animate-riseIn">
        <div className="flex flex-col items-center mb-7">
          <div className="w-16 h-16 rounded-2xl grid place-items-center bg-em-lime/15 border border-em-mint/30 shadow-glow mb-3">
            <span className="h-display text-3xl font-bold text-em-mint">◤</span>
          </div>
          <h1 className="h-display text-xl font-bold text-em-ink tracking-wide">EMMA Operator Console</h1>
          <p className="label mt-1.5">Robotic Surface Preparation</p>
        </div>

        <label className="block mb-4">
          <span className="label">Operator name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full bg-black/30 border border-em-mint/15 rounded-xl px-4 py-3 text-em-ink focus:border-em-mint focus:outline-none"
            required
          />
        </label>
        <label className="block mb-6">
          <span className="label">Badge ID</span>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="mt-1.5 w-full bg-black/30 border border-em-mint/15 rounded-xl px-4 py-3 text-em-ink font-mono focus:border-em-mint focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="btn w-full bg-em-lime/90 hover:bg-em-lime text-black font-bold py-3.5 text-base shadow-glow"
        >
          {busy ? 'Authenticating…' : 'Sign in to console'}
        </button>

        <div className="mt-5 flex items-center justify-between text-[11px] text-em-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-em-mint animate-pulse" /> Controller online
          </span>
          <span className="font-mono">SIM · no hardware required</span>
        </div>
      </form>
    </div>
  );
}
