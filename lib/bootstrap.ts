// Central bootstrap that can be imported by any route or server component
// to ensure optional monitoring and future one-time initializations occur.
import { initMonitoring } from './monitoring';

// Fire and forget initialization (idempotent)
initMonitoring().catch(() => {});

// Future: warm caches, preload models, etc.
export {}; // ensure module format
