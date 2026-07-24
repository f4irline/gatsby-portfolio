import { constants } from 'node:fs';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const distDirectory = path.resolve('dist');
const html = await readFile(path.join(distDirectory, 'index.html'), 'utf8');
const assetReferences = [...html.matchAll(/(?:href|src)="(\/[^"]+)"/g)].map(
    (match) => match[1].split(/[?#]/, 1)[0],
);

const missingAssets = [];
for (const assetReference of assetReferences) {
    if (assetReference === '/') continue;

    try {
        await access(path.join(distDirectory, assetReference), constants.F_OK);
    } catch {
        missingAssets.push(assetReference);
    }
}

if (missingAssets.length > 0) {
    throw new Error(`Missing built assets: ${missingAssets.join(', ')}`);
}

console.log(`Verified ${assetReferences.length} local asset references.`);
