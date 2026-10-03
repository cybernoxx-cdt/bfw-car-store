import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Lead, LeadStatus, SelectedModSnapshot } from "@/types";

const leadsRef = collection(db, "leads");

function toLead(id: string, data: Record<string, unknown>): Lead {
  return {
    id,
    carId: (data.carId as string) ?? "",
    carName: (data.carName as string) ?? "",
    selectedModifications: (data.selectedModifications as SelectedModSnapshot[]) ?? [],
    totalPrice: (data.totalPrice as number) ?? 0,
    currency: (data.currency as string) ?? "USD",
    customerName: data.customerName as string | undefined,
    customerPhone: data.customerPhone as string | undefined,
    status: ((data.status as LeadStatus) ?? "NEW"),
    createdAt: data.createdAt as Lead["createdAt"],
  };
}

export async function getAllLeads(): Promise<Lead[]> {
  const snap = await getDocs(query(leadsRef, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => toLead(d.id, d.data()));
}

export async function createLead(data: {
  carId: string;
  carName: string;
  selectedModifications: SelectedModSnapshot[];
  totalPrice: number;
  currency: string;
  customerName?: string;
  customerPhone?: string;
}) {
  const ref = await addDoc(leadsRef, {
    ...data,
    status: "NEW" as LeadStatus,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await updateDoc(doc(db, "leads", id), { status });
}
