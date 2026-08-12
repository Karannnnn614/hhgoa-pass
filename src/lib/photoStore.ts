import type { Photo } from "@/lib/photo";

type StoredPhoto = Photo;

const runtime = globalThis as typeof globalThis & {
  __hhgoaPhotoStore?: Map<string, StoredPhoto>;
};

const store = runtime.__hhgoaPhotoStore ?? new Map<string, StoredPhoto>();
runtime.__hhgoaPhotoStore = store;

export function savePhoto(key: string, photo: Photo) {
  store.set(key, photo);
}

export function getPhoto(key: string): Photo | null {
  const value = store.get(key);
  if (!value) return null;
  return value;
}
