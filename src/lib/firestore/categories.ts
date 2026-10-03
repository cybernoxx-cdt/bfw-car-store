import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Category } from "@/types";

const categoriesRef = collection(db, "categories");

function toCategory(id: string, data: Record<string, unknown>): Category {
  return {
    id,
    name: (data.name as string) ?? "",
    order: (data.order as number) ?? 0,
    createdAt: data.createdAt as Category["createdAt"],
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const snap = await getDocs(query(categoriesRef, orderBy("order", "asc")));
  return snap.docs.map((d) => toCategory(d.id, d.data()));
}

export async function createCategory(name: string, order: number) {
  const ref = await addDoc(categoriesRef, { name, order, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateCategory(id: string, data: Partial<Pick<Category, "name" | "order">>) {
  await updateDoc(doc(db, "categories", id), data);
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, "categories", id));
}
