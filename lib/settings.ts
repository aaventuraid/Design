import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), '.data');
const settingsPath = path.join(dataDir, 'settings.json');

export type AppSettings = {
  // AI Configuration
  geminiApiKey?: string;
  githubModelsApiKey?: string;
  defaultAIProvider?: 'gemini' | 'github-models' | 'local';

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
  try {
    const raw = await fs.readFile(settingsPath, 'utf-8');
    const json = JSON.parse(raw);
    return {
      ...defaultSettings,
      ...json,
      // Environment overrides
      geminiApiKey: process.env.GEMINI_API_KEY || json.geminiApiKey,
      githubModelsApiKey: process.env.GITHUB_MODELS_API_KEY || json.githubModelsApiKey,
      imageBgProvider:
        (process.env.IMAGE_BG_PROVIDER as any) ||
        json.imageBgProvider ||
        defaultSettings.imageBgProvider,
    };
  } catch {
    return {
      ...defaultSettings,
      geminiApiKey: process.env.GEMINI_API_KEY,
      githubModelsApiKey: process.env.GITHUB_MODELS_API_KEY,
      imageBgProvider: (process.env.IMAGE_BG_PROVIDER as any) || 'internal',
    };
  }
}

export async function saveSettings(next: Partial<AppSettings>): Promise<AppSettings> {
  await fs.mkdir(dataDir, { recursive: true });
  const current = await getSettings();
  const merged: AppSettings = { ...current, ...next };

  // Don't persist env-overridden values to file
  const toSave = { ...merged };
  if (process.env.GEMINI_API_KEY) delete toSave.geminiApiKey;
  if (process.env.GITHUB_MODELS_API_KEY) delete toSave.githubModelsApiKey;
  if (process.env.IMAGE_BG_PROVIDER) delete toSave.imageBgProvider;

  await fs.writeFile(settingsPath, JSON.stringify(toSave, null, 2));
  return merged;
}
