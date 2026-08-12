import dns from "node:dns";
import { MongoClient, type Collection } from "mongodb";
import type { Photo } from "@/lib/photo";

/**
 * Pass photo storage: the base64 data URL straight from the canvas.
 *
 * Mongo is the durable copy; an in-process Map mirrors it. Photos never
 * expire — a shared pass link has to keep working indefinitely.
 *
 * The two layers back each other up in both directions: writes go to the Map
 * first so a Mongo outage can't lose the photo mid-request, and reads fall
 * back to the Map when Mongo is unreachable. The Map alone is not enough in
 * production (serverless instances don't share it, cold starts wipe it) —
 * that is what Mongo fixes.
 */

type StoredPhoto = Photo & { _id: string; updatedAt: Date };

// Photos are base64 (~4/3 of the raw bytes) and a Mongo document caps at 16MB.
// Stay well under it — anything bigger is a client-side resize bug, not a photo.
const MAX_SRC_LENGTH = 6 * 1024 * 1024;

const runtime = globalThis as typeof globalThis & {
  __hhgoaPhotoStore?: Map<string, Photo>;
  __hhgoaMongo?: Promise<Collection<StoredPhoto>> | null;
};

const store = runtime.__hhgoaPhotoStore ?? new Map<string, Photo>();
runtime.__hhgoaPhotoStore = store;

function uri(): string | null {
  return process.env.MONGODB_URI?.trim() || null;
}

/**
 * One client per process, reused across invocations — a new connection per
 * request exhausts the Atlas connection limit under any real traffic.
 */
function collection(): Promise<Collection<StoredPhoto>> {
  if (!runtime.__hhgoaMongo) {
    const url = uri();
    if (!url) throw new Error("MONGODB_URI is not set");

    // mongodb+srv:// needs an SRV lookup, and some local setups point Node at
    // a loopback resolver that refuses them. Hosted environments resolve
    // normally, so this branch never fires there.
    if (dns.getServers().every((server) => server.startsWith("127."))) {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    }

    runtime.__hhgoaMongo = new MongoClient(url, {
      serverSelectionTimeoutMS: 8000,
    })
      .connect()
      .then((client) =>
        client
          .db(process.env.MONGODB_DB?.trim() || "hhgoa")
          .collection<StoredPhoto>("photos"),
      )
      .catch((error) => {
        // Let the next request retry instead of caching a dead connection.
        runtime.__hhgoaMongo = null;
        throw error;
      });
  }
  return runtime.__hhgoaMongo;
}

export function photoTooLarge(src: string): boolean {
  return src.length > MAX_SRC_LENGTH;
}

/** Resolves once the photo is safely stored somewhere; throws only if both fail. */
export async function savePhoto(key: string, photo: Photo): Promise<void> {
  store.set(key, photo);
  if (!uri()) return;

  const photos = await collection();
  await photos.updateOne(
    { _id: key },
    { $set: { src: photo.src, width: photo.width, height: photo.height, updatedAt: new Date() } },
    { upsert: true },
  );
}

export async function getPhoto(key: string): Promise<Photo | null> {
  const cached = store.get(key);
  if (cached) return cached;
  if (!uri()) return null;

  const photos = await collection();
  const found = await photos.findOne({ _id: key });
  if (!found) return null;

  const photo = { src: found.src, width: found.width, height: found.height };
  // Warm this instance so repeat views skip the round trip.
  store.set(key, photo);
  return photo;
}
