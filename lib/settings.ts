import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// Resolve candidate storage directories (env override -> project .data -> tmp)
export function getDataDirs() {
  const envDir = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : null;
  const projectDir = path.join(process.cwd(), '.data');
  const tmpDir = path.join(os.tmpdir(), 'yyc-data');
  return [envDir, projectDir, tmpDir].filter(Boolean) as string[];
}

async function readFirstExisting(paths: string[]): Promise<string | null> {
  for (const p of paths) {
    try {
      const raw = await fs.readFile(p, 'utf-8');
      return raw;
    } catch {
      /* continue */
    }
  }
  return null;
}

async function writeWithFallback(fileNames: string[], content: string): Promise<string> {
  let lastError: any;
  for (const file of fileNames) {
    try {
      const dir = path.dirname(file);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(file, content);
      return file;
    } catch (e: any) {
      lastError = e;
      continue;
    }
  }
  throw lastError || new Error('Failed to write settings to any data directory');
}

export async function getStorageInfo(): Promise<{
  candidates: string[];
  using?: string | null;
  writable: { dir: string; ok: boolean }[];
}> {
  const dirs = getDataDirs();
  const candidates = dirs.map((d) => path.join(d, 'settings.json'));
  let using: string | null = null;
  for (const c of candidates) {
    try {
      await fs.stat(c);
      using = c;
      break;
    } catch {
      /* not found */
    }
  }
  const writable = await Promise.all(
    dirs.map(async (d) => {
      try {
        await fs.mkdir(d, { recursive: true });
        // Try access write; if not supported, attempt a harmless touch
        await fs.access(d, (fs as any).constants?.W_OK ?? 2);
        return { dir: d, ok: true };
      } catch {
        return { dir: d, ok: false };
      }
    }),
  );
  return { candidates, using, writable };
}

export type AppSettings = {
  // AI Configuration
  geminiApiKey?: string;
  // Only Gemini and Local are supported
  defaultAIProvider?: 'gemini' | 'local';

  // Image Processing
  imageBgProvider?: 'internal' | 'external';
  defaultTolerance?: number;
  maxFileSize?: number; // in MB

  // Marketplace Configuration
  defaultMarketplace?: 'gofood' | 'grabfood' | 'shopeefood' | 'instagram';
  brandingEnabled?: boolean;
  watermarkEnabled?: boolean;

  // UI/UX Settings
  theme?: 'light' | 'dark' | 'auto';
  language?: 'id' | 'en';

  // Analytics & Monitoring
  analyticsEnabled?: boolean;
  processingHistory?: boolean;

  // Rate Limiting
  rateLimit?: number; // requests per hour

  // Brand Assets
  logoUrl?: string;
  brandColors?: {
    primary?: string;
    secondary?: string;
  };
};

const defaultSettings: AppSettings = {
  defaultAIProvider: 'local',
  imageBgProvider: 'internal',
  defaultTolerance: 12,
  maxFileSize: 8,
  defaultMarketplace: 'gofood',
  brandingEnabled: false,
  watermarkEnabled: false,
  theme: 'light',
  language: 'id',
  analyticsEnabled: true,
  processingHistory: true,
  rateLimit: 100,
};

export async function getSettings(): Promise<AppSettings> {
  const candidates = getDataDirs().map((d) => path.join(d, 'settings.json'));
  try {
    const raw = await readFirstExisting(candidates);
    const json = raw ? JSON.parse(raw) : {};
    return {
      ...defaultSettings,
      ...json,
      // Environment overrides
      geminiApiKey: process.env.GEMINI_API_KEY || json.geminiApiKey,
      imageBgProvider:
        (process.env.IMAGE_BG_PROVIDER as any) ||
        json.imageBgProvider ||
        defaultSettings.imageBgProvider,
    };
  } catch {
    return {
      ...defaultSettings,
      geminiApiKey: process.env.GEMINI_API_KEY,
      imageBgProvider: (process.env.IMAGE_BG_PROVIDER as any) || 'internal',
    };
  }
}

export async function saveSettings(next: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const merged: AppSettings = { ...current, ...next };

  // Don't persist env-overridden values to file
  const toSave = { ...merged };
  if (process.env.GEMINI_API_KEY) delete toSave.geminiApiKey;
  if (process.env.IMAGE_BG_PROVIDER) delete toSave.imageBgProvider;
  const candidates = getDataDirs().map((d) => path.join(d, 'settings.json'));
  await writeWithFallback(candidates, JSON.stringify(toSave, null, 2));
  return merged;
}
