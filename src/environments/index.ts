import { environmentLocal } from './environment';
import { environmentDev } from './environment.dev';
import { environmentProd } from './environment.prod';

/**
 * Equivalent of Angular `fileReplacements`:
 * - `vite` (serve)                 -> environment.ts       (local)
 * - `vite build --mode dev`        -> environment.dev.ts
 * - `vite build` (production mode) -> environment.prod.ts
 */
const environments: Record<string, typeof environmentLocal> = {
  production: environmentProd,
  dev: environmentDev,
};

export const environment = environments[import.meta.env.MODE] ?? environmentLocal;
