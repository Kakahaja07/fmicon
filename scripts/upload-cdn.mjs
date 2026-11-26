// Uploads dist-cdn/ to the Cloudflare R2 bucket behind cdn.fmicon.dev.
//   npm run cdn:build && npm run cdn:upload
//
// Needs an R2 API token (Cloudflare dashboard → R2 → Manage API tokens → Object Read & Write),
// given as environment variables. Never commit them:
//   R2_ACCOUNT_ID        your Cloudflare account ID
//   R2_ACCESS_KEY_ID     the token's access key ID
//   R2_SECRET_ACCESS_KEY the token's secret
//   R2_BUCKET            bucket name (default: icons, the bucket behind cdn.fmicon.dev)

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = "dist-cdn";
const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
const BUCKET = process.env.R2_BUCKET ?? "icons";
const CONCURRENCY = 24;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY first (see the top of this file).");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const TYPES = { ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json" };
// Icons rarely change: cache for a day at the edge and in browsers, serve stale while refreshing
const CACHE = "public, max-age=86400, stale-while-revalidate=604800";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(ROOT);
let done = 0;
let failed = 0;
const started = Date.now();

async function upload(path) {
  const key = relative(ROOT, path).split(sep).join("/");
  const ext = key.slice(key.lastIndexOf("."));
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await client.send(
        new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: readFileSync(path), ContentType: TYPES[ext] ?? "application/octet-stream", CacheControl: CACHE }),
      );
      return;
    } catch (error) {
      if (attempt === 3) {
        failed++;
        console.error(`✗ ${key}: ${error.message}`);
      }
    }
  }
}

// A small pool of parallel uploads
const queue = [...files];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      await upload(queue.shift());
      if (++done % 500 === 0) console.log(`${done} / ${files.length}`);
    }
  }),
);

console.log(`Uploaded ${files.length - failed} of ${files.length} files to ${BUCKET} in ${((Date.now() - started) / 1000).toFixed(0)}s${failed ? `, ${failed} failed` : ""}.`);
process.exit(failed ? 1 : 0);
