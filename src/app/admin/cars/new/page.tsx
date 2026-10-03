"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCar } from "@/lib/firestore/cars";
import { CarForm, type CarFormValues } from "@/components/admin/CarForm";
import { useToast } from "@/hooks/useToast";

export default function NewCarPage() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { push } = useToast();

  const handleSubmit = async (values: CarFormValues) => {
    setSubmitting(true);
    try {
      await createCar(values);
      push("Car added successfully.");
      router.push("/admin/cars");
    } catch {
      push("Couldn't save the car. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 font-display text-2xl font-bold uppercase text-bone">New Car</h1>
      <CarForm submitting={submitting} onSubmit={handleSubmit} submitLabel="Add Car" />
    </div>
  );
}
