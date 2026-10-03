import type { SelectedModSnapshot } from "@/types";

export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function buildWhatsAppMessage({
  carName,
  basePrice,
  currency,
  mods,
  total,
}: {
  carName: string;
  basePrice: number;
  currency: string;
  mods: SelectedModSnapshot[];
  total: number;
}) {
  const lines = [
    "Hello, I am interested in building this vehicle.",
    "",
    "Vehicle:",
    carName,
    "",
    "Base Price:",
    formatMoney(basePrice, currency),
  ];

  if (mods.length) {
    lines.push("", "Selected Modifications:", "");
    mods.forEach((m) => lines.push(`${m.name} — ${formatMoney(m.price, currency)}`));
  }

  lines.push("", "Total:", formatMoney(total, currency), "", "Please contact me regarding availability and purchase.");

  return lines.join("\n");
}

// Builds a wa.me deep link. `number` should be the full international
// number stored in Firestore (settings/business), digits only or with a
// leading +; both are normalized here.
export function buildWhatsAppLink(number: string, message: string) {
  const digitsOnly = (number || "").replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digitsOnly}?text=${encoded}`;
}
