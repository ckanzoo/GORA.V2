import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const env = loadEnv('native', root, 'VITE_');
const configured = env.VITE_API_BASE_URL?.trim();
let api;
try {
  api = new URL(configured ?? '');
} catch {
  // The bundled WebView has no API proxy, unlike the Vite development server.
}
if (
  !api || api.protocol !== 'https:' || api.username || api.password ||
  !/^\/*$/.test(api.pathname) || api.search || api.hash ||
  ['localhost', '127.0.0.1', '[::1]'].includes(api.hostname)
) {
  console.error(
    'Native builds require VITE_API_BASE_URL to be a public HTTPS API origin, without /api/v1. ' +
    'Set it in mobile/.env.native or in the build environment. See docs/features/native-app.md.',
  );
  process.exit(1);
}

for (const args of [
  ['node_modules/vue-tsc/bin/vue-tsc.js', '--noEmit'],
  ['node_modules/vite/bin/vite.js', 'build', '--mode', 'native'],
]) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
