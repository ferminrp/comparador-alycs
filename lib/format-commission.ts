import type { CommissionRate } from "@/lib/types";

export function formatCurrency(
  amount: number,
  currency: "ARS" | "USD" = "ARS",
): string {
  const prefix = currency === "USD" ? "US$" : "$";
  return `${prefix}${amount.toLocaleString("es-AR")}`;
}

function formatPercent(rate: number): string {
  const str = rate.toString().replace(".", ",");
  return `${str}%`;
}

function formatMinimum(
  minimum: number,
  currency: "ARS" | "USD" = "ARS",
): string {
  const prefix = currency === "USD" ? "US$" : "$";
  return `mín. ${prefix}${minimum.toLocaleString("es-AR")}`;
}

export function formatCommission(rate: CommissionRate | null): string {
  if (!rate) return "—";

  if (rate.unit === "tna") {
    const base = `${formatPercent(rate.rate)} TNA`;
    return rate.notes ? base : base;
  }

  if (rate.unit === "fixed") {
    if (rate.rate === 0) return "—";
    const currency = rate.minimumCurrency ?? "ARS";
    const prefix = currency === "USD" ? "US$" : "$";
    return `${prefix}${rate.rate.toLocaleString("es-AR")}/mes`;
  }

  let result = formatPercent(rate.rate);

  if (rate.minimum !== undefined) {
    result += ` (${formatMinimum(rate.minimum, rate.minimumCurrency)})`;
  }

  return result;
}
