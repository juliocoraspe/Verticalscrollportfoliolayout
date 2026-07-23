import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const source = resolve(root, 'docs');
const output = resolve(root, 'dist');
const clientOutput = resolve(output, 'client');
const serverOutput = resolve(output, 'server');
const metadataOutput = resolve(output, '.openai');

await rm(clientOutput, { force: true, recursive: true });
await rm(serverOutput, { force: true, recursive: true });
await rm(metadataOutput, { force: true, recursive: true });
await mkdir(output, { recursive: true });
await mkdir(clientOutput, { recursive: true });
await mkdir(serverOutput, { recursive: true });
await mkdir(metadataOutput, { recursive: true });
await cp(source, clientOutput, { recursive: true });
await cp(
  resolve(root, '.openai', 'hosting.json'),
  resolve(metadataOutput, 'hosting.json'),
);

await writeFile(
  resolve(serverOutput, 'index.js'),
  `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== "GET") return response;

    const url = new URL(request.url);
    if (url.pathname.includes(".")) return response;

    return env.ASSETS.fetch(
      new Request(new URL("/index.html", request.url), request),
    );
  },
};

export default worker;
`,
);
