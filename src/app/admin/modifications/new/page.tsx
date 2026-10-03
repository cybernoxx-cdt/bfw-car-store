"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createModification } from "@/lib/firestore/modifications";
import { ModificationForm, type ModificationFormValues } from "@/components/admin/ModificationForm";
import { useToast } from "@/hooks/useToast";

export default function NewModificationPage() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { push } = useToast();

  const handleSubmit = async (values: ModificationFormValues) => {
    setSubmitting(true);
    try {
      await createModification(values);
      push("Modification added successfully.");
      router.push("/admin/modifications");
    } catch {
      push("Couldn't save the modification. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 font-display text-2xl font-bold uppercase text-bone">New Modification</h1>
      <ModificationForm submitting={submitting} onSubmit={handleSubmit} submitLabel="Add Modification" />
    </div>
  );
}
