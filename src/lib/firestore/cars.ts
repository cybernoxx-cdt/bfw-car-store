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
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Car } from "@/types";

const carsRef = collection(db, "cars");

function toCar(id: string, data: Record<string, unknown>): Car {
  return {
    id,
    name: (data.name as string) ?? "",
    brand: (data.brand as string) ?? "",
    model: (data.model as string) ?? "",
    year: (data.year as number) ?? new Date().getFullYear(),
    category: (data.category as string) ?? "",
    basePrice: (data.basePrice as number) ?? 0,
    currency: (data.currency as string) ?? "USD",
    description: (data.description as string) ?? "",
    specifications: (data.specifications as Car["specifications"]) ?? {
      engine: "",
      power: "",
      torque: "",
      transmission: "",
      drive: "",
      topSpeed: "",
      zeroToHundred: "",
    },
    heroImage: (data.heroImage as string) ?? "",
    galleryImages: (data.galleryImages as string[]) ?? [],
    featured: Boolean(data.featured),
    available: data.available !== false,
    createdAt: data.createdAt as Car["createdAt"],
    updatedAt: data.updatedAt as Car["updatedAt"],
  };
}

export async function getAllCars(): Promise<Car[]> {
  const snap = await getDocs(query(carsRef, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => toCar(d.id, d.data()));
}

function seconds(value: Car["createdAt"]) {
  return value && typeof value === "object" && "seconds" in value ? value.seconds : 0;
}

export async function getAvailableCars(): Promise<Car[]> {
  const snap = await getDocs(query(carsRef, where("available", "==", true)));
  return snap.docs
    .map((d) => toCar(d.id, d.data()))
    .sort((a, b) => seconds(b.createdAt) - seconds(a.createdAt));
}

export async function getFeaturedCars(max = 8): Promise<Car[]> {
  const cars = await getAvailableCars();
  return cars.filter((c) => c.featured).slice(0, max);
}

export async function getCarById(id: string): Promise<Car | null> {
  const snap = await getDoc(doc(db, "cars", id));
  if (!snap.exists()) return null;
  return toCar(snap.id, snap.data());
}

export async function createCar(data: Omit<Car, "id" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(carsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCar(id: string, data: Partial<Omit<Car, "id">>) {
  await updateDoc(doc(db, "cars", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteCar(id: string) {
  await deleteDoc(doc(db, "cars", id));
}
