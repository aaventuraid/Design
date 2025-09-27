import { getSettings } from './settings';

let sentryInited = false;

export async function initMonitoring() {
  if (sentryInited) return;
  try {
    const settings = await getSettings();
    if (settings.sentryDsn) {
      // Indirect dynamic import so bundler does not eagerly analyze '@sentry/node'
    const dynamicImport = new Function('m', 'return import(m)'); // indirection keeps it out of static graph
    const Sentry: any = await (dynamicImport as any)('@sentry/node').catch(() => null);
      if (Sentry) {
        Sentry.init({
          dsn: settings.sentryDsn,
          tracesSampleRate: 0.1,
        });
        sentryInited = true;
      }
    }
  } catch {
    /* ignore */
  }
}

export async function captureError(err: any, context?: Record<string, any>) {
  try {
    const settings = await getSettings();
    if (!settings.sentryDsn) return;
    const dynamicImport = new Function('m', 'return import(m)');
    const Sentry: any = await (dynamicImport as any)('@sentry/node').catch(() => null);
    if (!Sentry) return;
    Sentry.captureException(err, { extra: context });
  } catch {/* ignore */}
}
