"use client";

import { useMemo, useState } from "react";
import { AlycLogo } from "@/components/AlycLogo";
import { calculateAllCommissions } from "@/lib/calculate-commission";
import { alycs, commissionConcepts } from "@/lib/alycs";
const DEFAULT_AMOUNT = 100_000;
const DEFAULT_CONCEPT_ID = "accionesCedears";

const tradeConcepts = commissionConcepts.filter(
  (concept) => concept.id !== "suscripcionMensual",
);

function parseAmountInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export function CommissionCalculator() {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [conceptId, setConceptId] = useState(DEFAULT_CONCEPT_ID);

  const selectedConcept = tradeConcepts.find((c) => c.id === conceptId);

  const results = useMemo(
    () => calculateAllCommissions(amount, conceptId, alycs),
    [amount, conceptId],
  );

  const alycById = useMemo(
    () => new Map(alycs.map((alyc) => [alyc.id, alyc])),
    [],
  );

  return (
    <section id="calculadora" className="scroll-mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Calculadora de comisiones
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Ingresá un monto y tipo de instrumento para estimar cuánto pagarías
          en comisión por operación en cada ALYC.
        </p>
      </div>

      <div className="mb-6 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <div>
          <label
            htmlFor="calc-amount"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Monto a operar (ARS)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-500">
              $
            </span>
            <input
              id="calc-amount"
              type="text"
              inputMode="numeric"
              value={amount > 0 ? amount.toLocaleString("es-AR") : ""}
              onChange={(e) => setAmount(parseAmountInput(e.target.value))}
              placeholder="0"
              className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-7 pr-3 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="calc-concept"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Tipo de instrumento
          </label>
          <select
            id="calc-concept"
            value={conceptId}
            onChange={(e) => setConceptId(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {tradeConcepts.map((concept) => (
              <option key={concept.id} value={concept.id}>
                {concept.label}
              </option>
            ))}
          </select>
          {selectedConcept ? (
            <p className="mt-1.5 text-xs text-zinc-500">
              {selectedConcept.description}
            </p>
          ) : null}
        </div>
      </div>

      {amount <= 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-500">
          Ingresá un monto mayor a cero para ver las comisiones estimadas.
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {results.map((result) => {
              const alyc = alycById.get(result.alycId);
              if (!alyc) return null;

              return (
                <article
                  key={result.alycId}
                  className={`rounded-2xl border bg-white p-4 shadow-sm ${
                    result.isCheapest
                      ? "border-emerald-300 ring-1 ring-emerald-200"
                      : "border-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlycLogo
                      domain={alyc.domain}
                      name={alyc.name}
                      size={28}
                    />
                    <div>
                      <p className="font-medium text-zinc-900">{alyc.shortName}</p>
                      <p className="text-xs text-zinc-500">{alyc.name}</p>
                    </div>
                  </div>
                  <p
                    className={`mt-3 text-lg font-semibold ${
                      result.isCheapest ? "text-emerald-700" : "text-zinc-900"
                    }`}
                  >
                    {result.formattedCommission}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    {result.detail}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm md:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-4 py-3 text-left font-medium text-zinc-700">
                    ALYC
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-700">
                    Comisión calculada
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-700">
                    Detalle
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => {
                  const alyc = alycById.get(result.alycId);
                  if (!alyc) return null;

                  return (
                    <tr
                      key={result.alycId}
                      className={
                        result.isCheapest
                          ? "bg-emerald-50/60"
                          : idx % 2 === 0
                            ? "bg-white"
                            : "bg-zinc-50/50"
                      }
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <AlycLogo
                            domain={alyc.domain}
                            name={alyc.name}
                            size={24}
                          />
                          <div>
                            <p className="font-medium text-zinc-900">
                              {alyc.shortName}
                            </p>
                            <p className="text-xs text-zinc-500">{alyc.name}</p>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`px-4 py-3 font-semibold ${
                          result.isCheapest
                            ? "text-emerald-700"
                            : "text-zinc-900"
                        }`}
                      >
                        {result.formattedCommission}
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{result.detail}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="mt-4 text-xs leading-5 text-zinc-500">
        Estimación sin IVA ni derechos de mercado. Las cauciones (TNA) requieren
        plazo en días para calcular el costo exacto. Cuando un ALYC tiene
        suscripción mensual fija, se muestra junto al costo por operación (p.
        ej. IEB+ Plan Investor).
      </p>
    </section>
  );
}
