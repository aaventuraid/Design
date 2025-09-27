import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/test-setup.ts'],
    testTimeout: 15000,
    coverage: {
      reporter: ['text', 'lcov'],
      thresholds: {
        // Raised gradually; increase after adding E2E & more negative cases
        statements: 55,
        branches: 45,
        functions: 50,
        lines: 55,
      },
    },
  },
});
