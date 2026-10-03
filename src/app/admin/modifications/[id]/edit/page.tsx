"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getModificationById, updateModification } from "@/lib/firestore/modifications";
import { ModificationForm, type ModificationFormValues } from "@/components/admin/ModificationForm";
import { useToast } from "@/hooks/useToast";
import type { Modification } from "@/types";

export default function EditModificationPage() {
  const { id } = useParams<{ id: string }>();
  const [mod, setMod] = useState<Modification | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { push } = useToast();

  useEffect(() => {
    getModificationById(id).then(setMod);
  }, [id]);

  const handleSubmit = async (values: ModificationFormValues) => {
    setSubmitting(true);
    try {
      await updateModification(id, values);
      push("Modification updated successfully.");
      router.push("/admin/modifications");
    } catch {
      push("Couldn't update the modification. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mod) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-ignition" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 font-display text-2xl font-bold uppercase text-bone">Edit Modification</h1>
      <ModificationForm initial={mod} submitting={submitting} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
}
