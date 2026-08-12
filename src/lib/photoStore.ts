import type { Photo } from "@/lib/photo";

type StoredPhoto = Photo & { expiresAt: number };

const runtime = globalThis as typeof globalThis & {
  __hhgoaPhotoStore?: Map<string, StoredPhoto>;
};

const store = runtime.__hhgoaPhotoStore ?? new Map<string, StoredPhoto>();
runtime.__hhgoaPhotoStore = store;

const TTL_MS = 24 * 60 * 60 * 1000;

export function savePhoto(key: string, photo: Photo) {
  store.set(key, { ...photo, expiresAt: Date.now() + TTL_MS });
}

export function getPhoto(key: string): Photo | null {
  const value = store.get(key);
  if (!value) return null;
  if (value.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }
  return { src: value.src, width: value.width, height: value.height };
}
