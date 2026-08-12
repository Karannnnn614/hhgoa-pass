/**
 * Round-trips a photo through the store. With MONGODB_URI set it exercises the
 * real database (run this after pasting the URI to prove it works); without it,
 * the in-memory fallback.
 *
 *   node scripts/check-photostore.mjs
 */
import assert from "node:assert/strict";
import { register } from "node:module";
import { pathToFileURL } from "node:url";

// The store imports via the "@/..." alias, which plain node doesn't resolve.
register(
  `data:text/javascript,
   export async function resolve(spec, ctx, next) {
     if (spec.startsWith("@/")) {
       return next(new URL("src/" + spec.slice(2) + ".ts", ${JSON.stringify(pathToFileURL(process.cwd() + "/").href)}).href, ctx);
     }
     return next(spec, ctx);
   }`,
  import.meta.url,
);

const { savePhoto, getPhoto, photoTooLarge } = await import("../src/lib/photoStore.ts");

const where = process.env.MONGODB_URI ? "mongodb" : "memory";
const key = `selftest-${process.pid}`;
const photo = {
  // 1x1 gif, the smallest valid data URL
  src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  width: 1,
  height: 1,
};

await savePhoto(key, photo);
const got = await getPhoto(key);
assert.deepEqual(got, photo, "photo should round-trip unchanged");

assert.equal(await getPhoto(`missing-${key}`), null, "unknown key returns null");

assert.equal(photoTooLarge("x".repeat(1000)), false);
assert.equal(photoTooLarge("x".repeat(7 * 1024 * 1024)), true, "oversized photo rejected");

console.log(`ok — photo store round-trips via ${where}`);
process.exit(0);
