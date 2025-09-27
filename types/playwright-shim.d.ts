// Temporary shim so TypeScript in this workspace stops reporting
// '@playwright/test' missing module errors inside editor tooling.
// In runtime and during actual tests, real Playwright types exist.
// If your editor resolves proper types later, you may delete this file.
declare module '@playwright/test' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const test: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const expect: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const devices: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function defineConfig(config: any): any;
}
