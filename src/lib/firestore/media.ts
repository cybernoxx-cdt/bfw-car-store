import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MediaItem } from "@/types";

const mediaRef = collection(db, "media");

function toMedia(id: string, data: Record<string, unknown>): MediaItem {
  return {
    id,
    url: (data.url as string) ?? "",
    publicId: (data.publicId as string) ?? "",
    resourceType: (data.resourceType as MediaItem["resourceType"]) ?? "image",
    folder: (data.folder as string) ?? "",
    createdAt: data.createdAt as MediaItem["createdAt"],
  };
}

// Cloudinary's own asset listing needs the (secret-bearing) Admin API, which
// must never run in the browser. Instead every successful upload writes a
// small record here, so the admin Media Library can list/search/delete
// through Firestore alone while the binary stays on Cloudinary's CDN.
export async function recordMediaUpload(item: Omit<MediaItem, "id" | "createdAt">) {
  const ref = await addDoc(mediaRef, { ...item, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getAllMedia(): Promise<MediaItem[]> {
  const snap = await getDocs(query(mediaRef, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => toMedia(d.id, d.data()));
}

export async function deleteMediaRecord(id: string) {
  await deleteDoc(doc(db, "media", id));
}
