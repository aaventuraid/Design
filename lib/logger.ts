interface LogContext {
  reqId?: string;
  userId?: string | null;
  [key: string]: any;
}

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function redact(ctx?: LogContext) {
  if (!ctx) return ctx;
  const clone: any = { ...ctx };
  const sensitiveKeys = [/password/i, /token/i, /authorization/i, /secret/i];
  for (const k of Object.keys(clone)) {
    if (sensitiveKeys.some((rgx) => rgx.test(k))) {
      clone[k] = '[REDACTED]';
    }
    if (typeof clone[k] === 'string' && clone[k].length > 500) {
      clone[k] = clone[k].slice(0, 500) + '…';
    }
  }
  return clone;
}

function format(level: LogLevel, message: string, ctx?: LogContext) {
  const base: any = {
    t: new Date().toISOString(),
    level,
    msg: message,
    ...redact(ctx),
  };
  return JSON.stringify(base);
}

export const logger = {
  info: (msg: string, ctx?: LogContext) => console.log(format('info', msg, ctx)),
  warn: (msg: string, ctx?: LogContext) => console.warn(format('warn', msg, ctx)),
  error: (msg: string, ctx?: LogContext) => console.error(format('error', msg, ctx)),
  debug: (msg: string, ctx?: LogContext) => {
    if (process.env.NODE_ENV !== 'production') console.debug(format('debug', msg, ctx));
  },
};

export function withReqId<T>(fn: (reqId: string) => Promise<T> | T) {
  const reqId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return fn(reqId);
}
