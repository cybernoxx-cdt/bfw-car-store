"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getCarById, updateCar } from "@/lib/firestore/cars";
import { CarForm, type CarFormValues } from "@/components/admin/CarForm";
import { useToast } from "@/hooks/useToast";
import type { Car } from "@/types";

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { push } = useToast();

  useEffect(() => {
    getCarById(id).then(setCar);
  }, [id]);

  const handleSubmit = async (values: CarFormValues) => {
    setSubmitting(true);
    try {
      await updateCar(id, values);
      push("Car updated successfully.");
      router.push("/admin/cars");
    } catch {
      push("Couldn't update the car. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!car) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-ignition" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 font-display text-2xl font-bold uppercase text-bone">Edit Car</h1>
      <CarForm initial={car} submitting={submitting} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
}
