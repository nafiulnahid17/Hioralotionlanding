import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const entries = await readdir(dist, { withFileTypes: true });
const workerDir = entries.find((entry) => entry.isDirectory() && !['client', 'server', '.openai'].includes(entry.name));

if (!workerDir) throw new Error('Cloudflare Worker build directory was not found.');

const source = new URL(`../dist/${workerDir.name}/index.js`, import.meta.url);
const serverDir = new URL('../dist/server/', import.meta.url);
const hostingDir = new URL('../dist/.openai/', import.meta.url);

await mkdir(serverDir, { recursive: true });
await mkdir(hostingDir, { recursive: true });
await copyFile(source, new URL('index.js', serverDir));
await copyFile(new URL('../.openai/hosting.json', import.meta.url), new URL('hosting.json', hostingDir));

console.log(`Prepared Sites Worker from ${join('dist', workerDir.name, 'index.js')}.`);
