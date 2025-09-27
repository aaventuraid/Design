// Unified API response & handler helpers to reduce duplication
import { NextResponse } from 'next/server';

export interface ErrorPayload {
  error: string;
  code?: string;
  details?: any;
}

export function jsonSuccess(data: any, init?: ResponseInit) {
  return NextResponse.json({ success: true, ...data }, { status: 200, ...init });
}

export function jsonCreated(data: any, init?: ResponseInit) {
  return NextResponse.json({ success: true, ...data }, { status: 201, ...init });
}

export function jsonError(message: string, status: number = 400, extra?: Partial<ErrorPayload>) {
  return NextResponse.json(
    { success: false, error: message, ...extra },
    { status },
  );
}

// Higher-order try/catch wrapper
export function withRoute(handler: () => Promise<NextResponse>) {
  return handler().catch((err: any) => {
    console.error('Route error:', err);
    return jsonError(err?.message || 'Internal server error', 500);
  });
}
