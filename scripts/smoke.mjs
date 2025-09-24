/*
  Simple E2E smoke test for local dev:
  - GET /api/health
  - POST /api/admin/settings
  - POST /api/generate-copy
  - POST /api/process (multipart)
*/

const base = process.env.BASE_URL || 'http://localhost:3000';

async function jsonFetch(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch { }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`);
  return parsed ?? text;
}

async function testHealth() {
  const data = await jsonFetch(`${base}/api/health`);
  console.log('health:', data);
}

async function testAdminSettings() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.log('⚠️  Skipping admin settings test - ADMIN_PASSWORD not set');
    return;
  }

  const payload = { type: 'system_settings', theme: 'light', analyticsEnabled: true };
  const res = await jsonFetch(`${base}/api/admin/management`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': adminPassword,
    },
    body: JSON.stringify(payload),
  });
  console.log('admin settings saved (theme=light), response:', res.success ? 'OK' : 'Failed');
}

async function testGenerateCopy() {
  const payload = {
    productName: 'Beef Yakiniku',
    platform: 'gofood',
    language: 'id',
    tone: 'casual',
    bananaMode: true,
  };
  const res = await jsonFetch(`${base}/api/generate-copy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  console.log('generate-copy:', {
    title: res.title,
    provider: res.providers?.find((p) => p.available)?.name || 'Local',
  });
}

async function testProcess() {
  // 1x1 PNG buffer
  const b64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4z8DwHwAFgwJ/l3OS4wAAAABJRU5ErkJggg==';
  const buf = Buffer.from(b64, 'base64');
  const fd = new FormData();
  const file = new File([buf], 'tiny.png', { type: 'image/png' });
  fd.append('preset', 'general');
  fd.append('tolerance', '12');
  fd.append('branding', 'false');
  fd.append('image', file);
  const res = await fetch(`${base}/api/process`, { method: 'POST', body: fd });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`process: ${res.status} ${res.statusText} - ${errText}`);
  }
  const market = res.headers.get('x-marketplace');
  const dims = res.headers.get('x-dimensions');
  const out = await res.arrayBuffer();
  console.log('process:', { marketplace: market, dimensions: dims, bytes: out.byteLength });
}

(async () => {
  try {
    await testHealth();
    await testAdminSettings();
    await testGenerateCopy();
    await testProcess();
    console.log('Smoke tests: OK');
    process.exit(0);
  } catch (e) {
    console.error('Smoke tests failed:', e?.message || e);
    process.exit(1);
  }
})();
