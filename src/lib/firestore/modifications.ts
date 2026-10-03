import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Modification } from "@/types";

const modsRef = collection(db, "modifications");

function toMod(id: string, data: Record<string, unknown>): Modification {
  return {
    id,
    carId: (data.carId as string) ?? "",
    compatibility: (data.compatibility as string[]) ?? [],
    categoryId: (data.categoryId as string) ?? "",
    name: (data.name as string) ?? "",
    description: (data.description as string) ?? "",
    price: (data.price as number) ?? 0,
    currency: (data.currency as string) ?? "USD",
    image: (data.image as string) ?? "",
    gallery: (data.gallery as string[]) ?? [],
    overlayImage: data.overlayImage as string | undefined,
    overlayTop: data.overlayTop as number | undefined,
    overlayLeft: data.overlayLeft as number | undefined,
    overlayWidth: data.overlayWidth as number | undefined,
    available: data.available !== false,
    featured: Boolean(data.featured),
    createdAt: data.createdAt as Modification["createdAt"],
    updatedAt: data.updatedAt as Modification["updatedAt"],
  };
}

export async function getAllModifications(): Promise<Modification[]> {
  const snap = await getDocs(modsRef);
  return snap.docs.map((d) => toMod(d.id, d.data()));
}

/** Every modification compatible with a given car: either it was authored
 * directly against that car, or the car's id is listed in `compatibility`. */
export async function getModificationsForCar(carId: string): Promise<Modification[]> {
  const [primary, compatible] = await Promise.all([
    getDocs(query(modsRef, where("carId", "==", carId), where("available", "==", true))),
    getDocs(query(modsRef, where("compatibility", "array-contains", carId), where("available", "==", true))),
  ]);
  const byId = new Map<string, Modification>();
  primary.docs.forEach((d) => byId.set(d.id, toMod(d.id, d.data())));
  compatible.docs.forEach((d) => byId.set(d.id, toMod(d.id, d.data())));
  return Array.from(byId.values());
}

export async function getModificationById(id: string): Promise<Modification | null> {
  const snap = await getDoc(doc(db, "modifications", id));
  if (!snap.exists()) return null;
  return toMod(snap.id, snap.data());
}

export async function createModification(data: Omit<Modification, "id" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(modsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateModification(id: string, data: Partial<Omit<Modification, "id">>) {
  await updateDoc(doc(db, "modifications", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteModification(id: string) {
  await deleteDoc(doc(db, "modifications", id));
}
