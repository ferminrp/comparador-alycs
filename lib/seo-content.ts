import { calculateAllCommissions } from "@/lib/calculate-commission";
import { commissionConcepts } from "@/lib/alycs";
import { formatCommission } from "@/lib/format-commission";
import type { Alyc } from "@/lib/types";
import type { FaqItem } from "@/lib/seo";

const REFERENCE_AMOUNT = 100_000;

const tradeConcepts = commissionConcepts.filter(
  (concept) => concept.id !== "suscripcionMensual",
);

function getCommissionText(alyc: Alyc, conceptId: string): string {
  return formatCommission(alyc.commissions[conceptId] ?? null);
}

function getLastUpdated(alyc: Alyc): string | null {
  const dates = Object.values(alyc.commissions)
    .filter((rate): rate is NonNullable<typeof rate> => rate !== null)
    .map((rate) => rate.lastUpdated)
    .filter((date): date is string => Boolean(date));

  if (dates.length === 0) return null;
  return dates.sort().reverse()[0] ?? null;
}

export function buildAlycIntro(alyc: Alyc): string {
  const acciones = getCommissionText(alyc, "accionesCedears");
  const mep = getCommissionText(alyc, "dolarMep");
  const monthly = getCommissionText(alyc, "suscripcionMensual");
  const lastUpdated = getLastUpdated(alyc);

  const parts = [
    `${alyc.name} es una de las ALYC (Agentes de Liquidación y Compensación) más consultadas en Argentina.`,
    `En operaciones de acciones y CEDEARs sin asesor, su comisión publicada es ${acciones}.`,
  ];

  if (mep !== "—") {
    parts.push(`Para dólar MEP, el arancel indicado es ${mep}.`);
  }

  if (monthly !== "—") {
    parts.push(`Además, contempla un arancel mensual de ${monthly}.`);
  }

  if (alyc.notes) {
    parts.push(alyc.notes);
  }

  if (lastUpdated) {
    parts.push(`Datos actualizados al ${formatDate(lastUpdated)}.`);
  }

  return parts.join(" ");
}

export function buildAlycFaqs(alyc: Alyc): FaqItem[] {
  const acciones = getCommissionText(alyc, "accionesCedears");
  const bonos = getCommissionText(alyc, "bonosPublicos");
  const mep = getCommissionText(alyc, "dolarMep");
  const monthly = getCommissionText(alyc, "suscripcionMensual");

  const faqs: FaqItem[] = [
    {
      question: `¿Cuánto cobra ${alyc.shortName} por acciones y CEDEARs?`,
      answer: `${alyc.shortName} publica una comisión de ${acciones} para compra y venta de acciones y CEDEARs en pesos (trading online, sin asesor). Los valores no incluyen IVA ni derechos de mercado.`,
    },
    {
      question: `¿Cuál es la comisión de ${alyc.shortName} en bonos?`,
      answer: `Para bonos públicos, ${alyc.shortName} cobra ${bonos}. Para ONs y títulos privados, la tarifa publicada es ${getCommissionText(alyc, "bonosPrivados")}.`,
    },
    {
      question: `¿Dónde puedo ver el tarifario oficial de ${alyc.shortName}?`,
      answer: `El tarifario oficial está disponible en ${alyc.tarifarioUrl}. Siempre verificá la fuente antes de operar, ya que las comisiones pueden cambiar.`,
    },
  ];

  if (mep !== "—") {
    faqs.push({
      question: `¿Cuánto cobra ${alyc.shortName} por dólar MEP?`,
      answer: `La comisión publicada para operaciones de dólar MEP es ${mep}.`,
    });
  }

  if (monthly !== "—") {
    faqs.push({
      question: `¿${alyc.shortName} tiene suscripción mensual?`,
      answer: `Sí, ${alyc.shortName} contempla un arancel mensual de ${monthly} según su plan base sin asesor.`,
    });
  }

  return faqs;
}

type ComparisonWinner = {
  conceptId: string;
  label: string;
  winnerShortName: string | null;
  tie: boolean;
};

function comparePairOnConcept(
  alycA: Alyc,
  alycB: Alyc,
  conceptId: string,
): ComparisonWinner {
  const concept = commissionConcepts.find((item) => item.id === conceptId);
  const results = calculateAllCommissions(REFERENCE_AMOUNT, conceptId, [
    alycA,
    alycB,
  ]);

  const resultA = results.find((item) => item.alycId === alycA.id);
  const resultB = results.find((item) => item.alycId === alycB.id);

  if (!resultA || !resultB) {
    return {
      conceptId,
      label: concept?.label ?? conceptId,
      winnerShortName: null,
      tie: true,
    };
  }

  if (resultA.notApplicable && resultB.notApplicable) {
    return {
      conceptId,
      label: concept?.label ?? conceptId,
      winnerShortName: null,
      tie: true,
    };
  }

  if (resultA.notApplicable) {
    return {
      conceptId,
      label: concept?.label ?? conceptId,
      winnerShortName: alycB.shortName,
      tie: false,
    };
  }

  if (resultB.notApplicable) {
    return {
      conceptId,
      label: concept?.label ?? conceptId,
      winnerShortName: alycA.shortName,
      tie: false,
    };
  }

  if (resultA.sortValue === resultB.sortValue) {
    return {
      conceptId,
      label: concept?.label ?? conceptId,
      winnerShortName: null,
      tie: true,
    };
  }

  const winner =
    resultA.sortValue < resultB.sortValue
      ? alycA.shortName
      : alycB.shortName;

  return {
    conceptId,
    label: concept?.label ?? conceptId,
    winnerShortName: winner,
    tie: false,
  };
}

export function buildComparisonSummary(alycA: Alyc, alycB: Alyc): string {
  const winners = tradeConcepts.map((concept) =>
    comparePairOnConcept(alycA, alycB, concept.id),
  );

  const aWins = winners.filter((item) => item.winnerShortName === alycA.shortName);
  const bWins = winners.filter((item) => item.winnerShortName === alycB.shortName);
  const ties = winners.filter((item) => item.tie);

  const winDetails = winners
    .filter((item) => !item.tie && item.winnerShortName)
    .slice(0, 4)
    .map(
      (item) =>
        `${item.label}: ${item.winnerShortName} (${getCommissionText(alycA, item.conceptId)} vs ${getCommissionText(alycB, item.conceptId)})`,
    );

  const parts = [
    `Comparativa de comisiones entre ${alycA.name} y ${alycB.name} con datos del tarifario oficial.`,
    `Con un monto de referencia de $${REFERENCE_AMOUNT.toLocaleString("es-AR")}, ${alycA.shortName} resulta más económico en ${aWins.length} instrumentos y ${alycB.shortName} en ${bWins.length}.`,
  ];

  if (ties.length > 0) {
    parts.push(`${ties.length} conceptos empatan o no aplican a ambos.`);
  }

  if (winDetails.length > 0) {
    parts.push(`Diferencias destacadas: ${winDetails.join("; ")}.`);
  }

  parts.push(
    "Los valores no incluyen IVA ni derechos de mercado. Verificá siempre el tarifario oficial antes de operar.",
  );

  return parts.join(" ");
}

export function buildComparisonFaqs(alycA: Alyc, alycB: Alyc): FaqItem[] {
  const accionesA = getCommissionText(alycA, "accionesCedears");
  const accionesB = getCommissionText(alycB, "accionesCedears");
  const winners = tradeConcepts.map((concept) =>
    comparePairOnConcept(alycA, alycB, concept.id),
  );

  const accionesWinner = winners.find(
    (item) => item.conceptId === "accionesCedears",
  );

  let accionesAnswer = `En acciones y CEDEARs, ${alycA.shortName} cobra ${accionesA} y ${alycB.shortName} cobra ${accionesB}.`;
  if (accionesWinner?.winnerShortName && !accionesWinner.tie) {
    accionesAnswer += ` Para una operación de $${REFERENCE_AMOUNT.toLocaleString("es-AR")}, ${accionesWinner.winnerShortName} resulta más económico.`;
  }

  return [
    {
      question: `¿${alycA.shortName} o ${alycB.shortName}: cuál es más barato en acciones?`,
      answer: accionesAnswer,
    },
    {
      question: `¿Dónde consulto los tarifarios oficiales?`,
      answer: `El tarifario de ${alycA.shortName} está en ${alycA.tarifarioUrl}. El de ${alycB.shortName} en ${alycB.tarifarioUrl}.`,
    },
    {
      question: `¿Estas comisiones incluyen IVA y derechos de mercado?`,
      answer:
        "No. Las tarifas publicadas son comisiones de corretaje según cada ALYC. IVA, derechos de mercado y otros cargos pueden aplicarse por separado según el tipo de operación.",
    },
    {
      question: `¿Puedo comparar otros instrumentos entre ${alycA.shortName} y ${alycB.shortName}?`,
      answer: `Sí. En esta página encontrás la tabla completa con acciones, bonos, opciones, cauciones, FCI y dólar MEP. También podés usar la calculadora de la home para estimar el costo según el monto que vayas a operar.`,
    },
  ];
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}
