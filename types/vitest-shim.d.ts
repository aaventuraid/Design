// Shim declarations so the editor/type checker in constrained environments
// (e.g. before node_modules installed) does not error on vitest imports.
declare module 'vitest' {
  export const describe: any;
  export const it: any;
  export const expect: any;
  export const beforeAll: any;
  export const afterAll: any;
}

declare module 'vitest/config' {
  export function defineConfig(config: any): any;
  const _default: typeof defineConfig;
  export default _default;
}
