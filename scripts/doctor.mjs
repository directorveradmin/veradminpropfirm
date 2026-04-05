import { existsSync } from 'node:fs';
import { join } from 'node:path';

const required = [
  'src',
  'db',
  'src-tauri',
  'scripts',
  '.env.example'
];

const missing = required.filter((p) => !existsSync(join(process.cwd(), p)));

if (missing.length > 0) {
  console.error('Veradmin scaffold check failed. Missing:', missing.join(', '));
  process.exit(1);
}

console.log('Veradmin scaffold check passed.');
