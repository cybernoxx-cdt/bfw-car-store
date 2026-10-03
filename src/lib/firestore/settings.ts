import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BusinessSettings } from "@/types";

const settingsDoc = doc(db, "settings", "business");

export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: "Your Showroom",
  logo: "",
  whatsappNumber: "",
  phone: "",
  email: "",
  address: "",
  instagram: "",
  facebook: "",
  currency: "USD",
  businessHours: "Mon–Sat, 9:00 AM – 6:00 PM",
  accentColor: "#ff6a1a",
};

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const snap = await getDoc(settingsDoc);
  if (!snap.exists()) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<BusinessSettings>) };
}

export async function updateBusinessSettings(data: Partial<BusinessSettings>) {
  await setDoc(settingsDoc, data, { merge: true });
}
