import fs from 'fs';
import { runCustomSimulation } from './src/core/sandbox/CustomSandbox.js';
const code = `function customRecursion(n) {
  if (n <= 1) return n;
  return customRecursion(n - 1) + customRecursion(n - 2);
}`;
try {
  console.log('Running sandbox...');
  const result = runCustomSimulation(code, [3]);
  fs.writeFileSync('snapshots.json', JSON.stringify(result, null, 2));
  console.log('Wrote snapshots.json');
} catch (e) {
  console.error('Crash!', e);
}
