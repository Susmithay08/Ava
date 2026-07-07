// fleet.js — a simulated fleet of robots for the Overview dashboard.
// One physical robot doesn't exist, so like the rest of the app this is a
// coherent SIM: each robot advances its own part, occasionally goes idle, and
// the aggregate output tracks a production target.

const TASKS = ['Welding', 'Handling', 'Assembly', 'Machine Tending', 'Palletizing', 'Inspection'];

function pad(n) {
  return String(n).padStart(2, '0');
}

export function createFleet() {
  const robots = [];
  for (let i = 1; i <= 24; i++) {
    const model = i % 3 === 0 ? 'TA-1800' : 'TA-2000';
    const task = TASKS[i % TASKS.length];
    // 20 running, 3 idle, 1 alert (matches the target dashboard)
    let status = 'running';
    if (i === 4) status = 'alert';
    else if (i === 7 || i === 12 || i === 19) status = 'idle';
    robots.push({
      id: `${model}-${pad(i)}`,
      model,
      task,
      cell: `${task} Cell ${pad(((i - 1) % 12) + 1)}`,
      status,
      health: status === 'alert' ? 'fault' : status === 'idle' ? 'warning' : 'healthy',
      completion: status === 'idle' ? 20 + ((i * 7) % 40) : 40 + ((i * 13) % 55),
      rate: 0.4 + ((i * 11) % 60) / 100, // parts/sec-ish
      parts: 0,
    });
  }
  return {
    robots,
    startedAt: Date.now(),
    totalOutput: 8000 + Math.floor(Math.random() * 400),
    targetOutput: 10200,
    history: [], // { t, actual, target }
    tick: 0,
  };
}

export function stepFleet(fleet) {
  fleet.tick++;
  let produced = 0;
  fleet.robots.forEach((r) => {
    if (r.status === 'running') {
      r.completion += r.rate * 2.2;
      if (r.completion >= 100) {
        r.completion -= 100;
        r.parts++;
        produced++;
      }
      // rare state changes
      if (Math.random() < 0.0006) r.status = 'idle';
    } else if (r.status === 'idle') {
      if (Math.random() < 0.02) {
        r.status = 'running';
        r.health = 'healthy';
      }
    }
    r.completion = Math.max(0, Math.min(100, r.completion));
  });
  fleet.totalOutput += produced;

  // production series: target rises linearly, actual tracks output
  const t = Date.now();
  const targetInc = 1.6;
  const prevTarget = fleet.history.length ? fleet.history[fleet.history.length - 1].target : 0;
  const actual = fleet.history.length ? fleet.history[fleet.history.length - 1].actual : 0;
  fleet.history.push({ t, actual: actual + produced + Math.random() * 0.8, target: prevTarget + targetInc });
  if (fleet.history.length > 60) fleet.history.shift();

  return fleet;
}

export function fleetSummary(fleet) {
  const total = fleet.robots.length;
  const active = fleet.robots.filter((r) => r.status === 'running').length;
  const idle = fleet.robots.filter((r) => r.status === 'idle').length;
  const alerts = fleet.robots.filter((r) => r.status === 'alert').length;
  const efficiency = Math.round((fleet.totalOutput / fleet.targetOutput) * 1000) / 10;
  return {
    total,
    active,
    idle,
    alerts,
    totalOutput: fleet.totalOutput,
    targetOutput: fleet.targetOutput,
    efficiency,
    robots: fleet.robots.map((r) => ({
      id: r.id,
      cell: r.cell,
      task: r.task,
      status: r.status,
      health: r.health,
      completion: Math.round(r.completion),
    })),
    history: fleet.history.map((h) => ({
      t: h.t,
      actual: Math.round(h.actual),
      target: Math.round(h.target),
    })),
  };
}
