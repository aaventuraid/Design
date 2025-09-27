/**
 * Minimal smoke test for critical API endpoints.
 * Run with: npx tsx scripts/smoke-test.ts
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function json(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function testAuth() {
  const email = process.env.SMOKE_EMAIL || 'admin@yukiyaki.id';
  const password = process.env.SMOKE_PASSWORD || 'admin123';
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await json(res);
  if (!res.ok) throw new Error('Auth failed: ' + JSON.stringify(body));
  return body.token as string;
}

async function testGenerateCopy(token?: string) {
  const res = await fetch(`${BASE}/api/generate-copy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ productName: 'Beef Yakiniku Premium', platform: 'gofood' }),
  });
  const body = await json(res);
  if (!res.ok) throw new Error('Generate copy failed: ' + JSON.stringify(body));
  return body;
}

async function testProcess(token?: string) {
  const form = new FormData();
  // create a small blank PNG (1x1) base64
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
  const blob = Buffer.from(pngBase64, 'base64');
  form.append('image', new Blob([blob]), 'blank.png');
  form.append('preset', 'general');
  const res = await fetch(`${BASE}/api/process`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form,
  });
  if (!res.ok) {
    const body = await json(res);
    throw new Error('Process failed: ' + JSON.stringify(body));
  }
  return { size: +(res.headers.get('Content-Length') || 0) };
}

async function main() {
  const start = Date.now();
  const results: Record<string, any> = {};
  try {
    const token = await testAuth();
    results.auth = 'OK';
    const copy = await testGenerateCopy(token);
    results.copy = copy.reqId ? 'OK' : 'NO_REQ_ID';
    const proc = await testProcess();
    results.process = proc.size >= 0 ? 'OK' : 'EMPTY';
    const ms = Date.now() - start;
    console.log(JSON.stringify({ status: 'PASS', ms, results }, null, 2));
    process.exit(0);
  } catch (e: any) {
    console.error(JSON.stringify({ status: 'FAIL', error: e.message, results }, null, 2));
    process.exit(1);
  }
}

main();
