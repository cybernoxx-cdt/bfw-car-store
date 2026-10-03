import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AboutInfo } from "@/types";

const aboutDoc = doc(db, "about", "company");

export const DEFAULT_ABOUT: AboutInfo = {
  ownerName: "",
  ownerRole: "Founder",
  ownerImage: "",
  biography: "",
  companyStory: "",
  mission: "",
  vision: "",
  values: [],
};

export async function getAboutInfo(): Promise<AboutInfo> {
  const snap = await getDoc(aboutDoc);
  if (!snap.exists()) return DEFAULT_ABOUT;
  return { ...DEFAULT_ABOUT, ...(snap.data() as Partial<AboutInfo>) };
}

export async function updateAboutInfo(data: Partial<AboutInfo>) {
  await setDoc(aboutDoc, data, { merge: true });
}
