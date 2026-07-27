// Compares the reasons the queue renders (clinical-rules package) against the
// reasons the API returned for the same request. Run: node scripts/reason-parity.mjs
import { readFileSync } from 'node:fs';

const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url)));
const resolved = lock.packages['node_modules/@meridiancare/clinical-rules'];
const version = resolved.version;
const pkg = await import(new URL(`../vendor/clinical-rules-${version}/index.js`, import.meta.url));

const apiResponse = JSON.parse(readFileSync(new URL('./fixtures/api-determination.json', import.meta.url)));
const evaluation = { unmetRuleCodes: ['IMAGING_PRIOR'], allRequiredMet: false, confidence: 0.62 };

const queueReasons = pkg.denialReasons(evaluation);
const apiReasons = apiResponse.reasons;

console.log('resolved @meridiancare/clinical-rules:', version);
console.log('queue renders :', queueReasons);
console.log('api returned  :', apiReasons);

const same = JSON.stringify(queueReasons) === JSON.stringify(apiReasons);
console.log(same ? 'PARITY: reasons agree' : 'PARITY: reasons DISAGREE for the same request');
process.exit(same ? 0 : 1);
