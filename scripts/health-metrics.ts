/*
 * Project Health Metrics Script
 * Measures TypeScript compile errors and simple duplication indicators.
 * Creates a baseline on first run in .metrics-baseline.json then reports improvement %.
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface Metrics {
  timestamp: string;
  errors: number;
  duplicateTokens: number; // token extraction duplication
  manualRateLimitBlocks: number; // direct occurrences of rate limit message outside middleware
}

interface Report extends Metrics {
  improvement: {
    errors: number; // percentage
    duplicateTokens: number; // percentage
    overall: number; // simple average for now
  };
  baseline: Metrics;
}

const ROOT = process.cwd();
const BASELINE_FILE = path.join(ROOT, '.metrics-baseline.json');

function getTypeScriptErrorCount(): number {
  const tscPath = path.join(ROOT, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
  const tsc = spawnSync(tscPath, ['--noEmit', '--pretty', 'false'], { encoding: 'utf-8' });
  const output = (tsc.stderr || '') + (tsc.stdout || '');
  // Count lines that look like error TSXXXX:
  const errorLines = output.split(/\r?\n/).filter(l => /error TS\d+:/.test(l));
  return errorLines.length;
}

function getDuplicateTokenFunctions(): number {
  const utilsPath = path.join(ROOT, 'lib', 'utils.ts');
  if (!fs.existsSync(utilsPath)) return 0;
  const content = fs.readFileSync(utilsPath, 'utf-8');
  const bearerMatch = content.match(/export function extractBearerToken[^{]*{([\s\S]*?)}\n/);
  const authMatch = content.match(/export function extractAuthToken[^{]*{([\s\S]*?)}\n/);
  if (bearerMatch && authMatch) {
    const bodyA = bearerMatch[1].replace(/\s+/g, ' ').trim();
    const bodyB = authMatch[1].replace(/\s+/g, ' ').trim();
    // Duplication only if bodies are different
    return bodyA !== bodyB ? 1 : 0;
  }
  return 0;
}

function scanManualRateLimitBlocks(): number {
  // Look for hardcoded rate limit error strings outside middleware file
  const targetPhrase = 'Rate limit exceeded. Coba lagi sebentar.';
  let count = 0;
  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.next') || e.name === 'node_modules') continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile() && /\.tsx?$/.test(e.name)) {
        const content = fs.readFileSync(full, 'utf-8');
        if (content.includes(targetPhrase) &&
            !full.endsWith(`${path.sep}middleware.ts`) &&
            !full.endsWith(`${path.sep}lib${path.sep}middleware.ts`) &&
            !full.endsWith(`${path.sep}lib${path.sep}utils.ts`)) {
          count++;
        }
      }
    }
  }
  walk(ROOT);
  return count;
}

function loadOrCreateBaseline(current: Metrics): Metrics {
  if (fs.existsSync(BASELINE_FILE)) {
    try {
      const parsed: Metrics = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf-8'));
      return parsed;
    } catch {
      // Fallback: rewrite baseline
    }
  }
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(current, null, 2));
  return current;
}

function percentImprovement(baseline: number, current: number): number {
  if (baseline === 0) return baseline === current ? 100 : 0;
  const improvement = baseline - current;
  return Math.max(0, Math.min(100, +(improvement / baseline * 100).toFixed(2)));
}

function main() {
  const current: Metrics = {
    timestamp: new Date().toISOString(),
    errors: getTypeScriptErrorCount(),
    duplicateTokens: getDuplicateTokenFunctions(),
    manualRateLimitBlocks: scanManualRateLimitBlocks(),
  };

  const baseline = loadOrCreateBaseline(current);

  const report: Report = {
    ...current,
    baseline,
    improvement: {
      errors: percentImprovement(baseline.errors, current.errors),
      duplicateTokens: percentImprovement(baseline.duplicateTokens, current.duplicateTokens),
      overall: 0, // compute below
    },
  } as Report;

  // Simple overall average of tracked improvements
  const { errors: errImp, duplicateTokens: dupImp, manualRateLimitBlocks: rlImp } = report.improvement as any;
  report.improvement.overall = +(((errImp + dupImp + rlImp) / 3)).toFixed(2);

  console.log(JSON.stringify(report, null, 2));
}

main();
