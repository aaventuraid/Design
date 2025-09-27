// Shim for Next.js type mismatch during build complaining about ResolvingMetadata / ResolvingViewport
// If a future Next.js upgrade restores these exports, this file can be removed.
// We provide minimal placeholder interfaces so type-only imports succeed.
declare module 'next/types' {
  export type ResolvingMetadata = Record<string, unknown>;
  export type ResolvingViewport = Record<string, unknown>;
}

declare module 'next/types.js' {
  export type ResolvingMetadata = Record<string, unknown>;
  export type ResolvingViewport = Record<string, unknown>;
}
