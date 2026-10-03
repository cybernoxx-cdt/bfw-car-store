import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCarById } from "@/lib/firestore/cars";
import { getModificationsForCar } from "@/lib/firestore/modifications";
import { getAllCategories } from "@/lib/firestore/categories";
import { getBusinessSettings } from "@/lib/firestore/settings";
import { CarDetailClient } from "@/components/cars/CarDetailClient";
import { formatMoney } from "@/lib/whatsapp";

interface PageProps {
  params: { carId: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const car = await getCarById(params.carId);
  if (!car) return { title: "Vehicle Not Found" };

  const title = `${car.brand} ${car.model} (${car.year})`;
  const description =
    car.description?.slice(0, 155) ||
    `${car.brand} ${car.model} — starting at ${formatMoney(car.basePrice, car.currency)}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: car.heroImage ? [{ url: car.heroImage }] : undefined,
    },
  };
}

export default async function CarDetailPage({ params }: PageProps) {
  const car = await getCarById(params.carId);
  if (!car) notFound();

  const [mods, categories, settings] = await Promise.all([
    getModificationsForCar(car.id),
    getAllCategories(),
    getBusinessSettings(),
  ]);

  return <CarDetailClient car={car} modifications={mods} categories={categories} whatsappNumber={settings.whatsappNumber} />;
}
