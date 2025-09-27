// Lazy import redis to avoid build failure if dependency missing in some environments
type RedisClientType = any; // Soft type to avoid requiring @types
let client: RedisClientType | null = null;
let initPromise: Promise<RedisClientType | null> | null = null;

export async function getRedis(): Promise<RedisClientType | null> {
  if (client) return client;
  if (initPromise) return initPromise;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  initPromise = (async () => {
    try {
      const mod: any = await import('redis').catch(() => null);
      if (!mod) return null;
      const c = mod.createClient({ url });
      c.on('error', (err: any) => console.error('[redis] error', err));
      await c.connect();
      client = c;
      return c;
    } catch (e) {
      console.warn('[redis] connect failed, fallback to in-memory', (e as any)?.message);
      return null;
    }
  })();
  return initPromise;
}

export async function redisRateLimit(key: string, limit: number, windowSec: number) {
  const r = await getRedis();
  if (!r) return null; // caller should fallback
  const nowBucket = Math.floor(Date.now() / 1000 / windowSec);
  const redisKey = `rl:${key}:${nowBucket}`;
  const count = await r.incr(redisKey);
  if (count === 1) {
    await r.expire(redisKey, windowSec);
  }
  return { count, remaining: Math.max(0, limit - count), reset: (nowBucket + 1) * windowSec * 1000 };
}

export async function closeRedis() {
  if (client) {
    try { await client.quit(); } catch {}
    client = null;
  }
}