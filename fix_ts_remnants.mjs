// fix_ts_remnants.mjs
// Strips TypeScript syntax from .js and .jsx files using detype programmatically.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { execSync } from 'child_process';

const SRC = './src';

function walk(dir) {
  const results = [];
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) {
      results.push(...walk(full));
    } else if (['.js', '.jsx'].includes(extname(f))) {
      results.push(full);
    }
  }
  return results;
}

const files = walk(SRC);
let fixed = 0;

for (const file of files) {
  const content = readFileSync(file, 'utf8');

  // Quick check — skip files with no TS syntax
  if (
    !content.includes('import type') &&
    !content.includes(': string') &&
    !content.includes(': number') &&
    !content.includes(': boolean') &&
    !content.includes(': Record') &&
    !content.includes('?: ') &&
    !content.includes(': UserRole') &&
    !content.includes(': React.')
  ) continue;

  try {
    // Use detype on each file by writing a temp .ts copy
    const tmpTs = file + '.tmp.ts';
    writeFileSync(tmpTs, content);
    execSync(`npx detype "${tmpTs}" "${file}"`, { stdio: 'inherit' });
    // cleanup temp
    try { execSync(`del "${tmpTs}"`, { stdio: 'ignore', shell: true }); } catch {}
    fixed++;
    console.log('Fixed:', file);
  } catch (e) {
    console.warn('WARN: Could not process', file, '-', e.message.split('\n')[0]);
  }
}

console.log(`\nDone. Fixed ${fixed} files.`);
