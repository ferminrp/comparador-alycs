import { formatCommission, formatCurrency } from "@/lib/format-commission";
import type { Alyc, CommissionRate } from "@/lib/types";

export type CommissionCalculation = {
  alycId: string;
  formattedCommission: string;
  detail: string;
  sortValue: number;
  notApplicable: boolean;
  minimumApplied: boolean;
  isCheapest: boolean;
};

function calculateSingleCommission(
  amount: number,
  rate: CommissionRate | null | undefined,
): Omit<CommissionCalculation, "alycId" | "isCheapest"> {
  if (!rate) {
    return {
      formattedCommission: "No aplica",
      detail: "Sin tarifa para este instrumento",
      sortValue: Number.POSITIVE_INFINITY,
      notApplicable: true,
      minimumApplied: false,
    };
  }

  if (rate.unit === "tna") {
    return {
      formattedCommission: "—",
      detail: `${formatCommission(rate)} — requiere plazo en días para estimar`,
      sortValue: Number.POSITIVE_INFINITY,
      notApplicable: false,
      minimumApplied: false,
    };
  }

  if (rate.unit === "fixed") {
    const currency = rate.minimumCurrency ?? "ARS";
    const detailParts = ["Costo mensual, no por operación"];
    if (rate.notes) detailParts.push(rate.notes);

    return {
      formattedCommission: formatCurrency(rate.rate, currency),
      detail: detailParts.join(" · "),
      sortValue: rate.rate,
      notApplicable: false,
      minimumApplied: false,
    };
  }

  let commission = (amount * rate.rate) / 100;
  let minimumApplied = false;
  const currency = rate.minimumCurrency ?? "ARS";

  if (rate.minimum !== undefined && commission < rate.minimum) {
    commission = rate.minimum;
    minimumApplied = true;
  }

  let formattedCommission = formatCurrency(commission, currency);
  if (minimumApplied) {
    formattedCommission += " (mínimo aplicado)";
  }

  const detailParts = [
    `${rate.rate.toString().replace(".", ",")}% sobre ${formatCurrency(amount)}`,
  ];
  if (rate.minimum !== undefined) {
    detailParts.push(`mín. ${formatCurrency(rate.minimum, currency)}`);
  }
  if (rate.notes) detailParts.push(rate.notes);

  return {
    formattedCommission,
    detail: detailParts.join(" · "),
    sortValue: commission,
    notApplicable: false,
    minimumApplied,
  };
}

export function calculateAllCommissions(
  amount: number,
  conceptId: string,
  alycsList: Alyc[],
): CommissionCalculation[] {
  const results = alycsList.map((alyc) => ({
    alycId: alyc.id,
    ...calculateSingleCommission(amount, alyc.commissions[conceptId]),
  }));

  results.sort((a, b) => a.sortValue - b.sortValue);

  const cheapestValue = results.find((r) => Number.isFinite(r.sortValue))?.sortValue;

  return results.map((result) => ({
    ...result,
    isCheapest:
      cheapestValue !== undefined &&
      Number.isFinite(result.sortValue) &&
      result.sortValue === cheapestValue,
  }));
}
