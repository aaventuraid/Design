// Simple in-memory metrics (Prometheus text exposition) without external deps.
// Suitable for single-instance or ephemeral scaling; for multi-instance use a pull model per pod.

type LabelMap = Record<string, string>;

interface CounterSeries {
  value: number;
  labels: LabelMap;
}

const counters: Record<string, CounterSeries[]> = Object.create(null);

function findSeries(arr: CounterSeries[], labels: LabelMap) {
  const keys = Object.keys(labels).sort();
  return arr.find((s) => {
    const sk = Object.keys(s.labels).sort();
    if (sk.length !== keys.length) return false;
    return sk.every((k) => s.labels[k] === labels[k]);
  });
}

export function inc(name: string, value = 1, labels: LabelMap = {}) {
  if (!Number.isFinite(value)) return;
  const norm = sanitizeName(name);
  if (!counters[norm]) counters[norm] = [];
  let series = findSeries(counters[norm], labels);
  if (!series) {
    series = { value: 0, labels: { ...labels } };
    counters[norm].push(series);
  }
  series.value += value;
}

function sanitizeName(n: string) {
  return n.replace(/[^a-zA-Z0-9_]/g, '_');
}

export function snapshot() {
  const out: { name: string; series: CounterSeries[] }[] = [];
  for (const k of Object.keys(counters)) {
    out.push({ name: k, series: counters[k] });
  }
  return out;
}

export function prometheusText() {
  const lines: string[] = [];
  lines.push('# HELP app_metrics_collector Simple in-memory counters');
  lines.push('# TYPE app_metrics_collector gauge');
  lines.push(`app_metrics_collector{pid="${process.pid}"} 1`);
  for (const k of Object.keys(counters)) {
    lines.push(`# TYPE ${k} counter`);
    for (const s of counters[k]) {
      const labelPairs = Object.entries(s.labels)
        .map(([lk, lv]) => `${lk}="${escapeLabel(lv)}"`)
        .join(',');
      const labelBlock = labelPairs.length ? `{${labelPairs}}` : '';
      lines.push(`${k}${labelBlock} ${s.value}`);
    }
  }
  return lines.join('\n') + '\n';
}

function escapeLabel(v: string) {
  return v.replace(/"/g, '\\"');
}

// Convenience named helpers
export const Metrics = {
  request(route: string, status: number) {
    inc('requests_total', 1, { route, status: String(status) });
  },
  imageProcessed(preset: string, inBytes: number, outBytes: number, status: number) {
    inc('image_process_total', 1, { preset, status: String(status) });
    inc('image_bytes_input_total', inBytes);
    inc('image_bytes_output_total', outBytes);
  },
  copyGenerate(status: number) {
    inc('copy_generate_total', 1, { status: String(status) });
  },
  authLogin(status: number) {
    inc('auth_login_total', 1, { status: String(status) });
  },
};
