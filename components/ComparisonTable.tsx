"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlycLogo } from "@/components/AlycLogo";
import { alycs, commissionConcepts } from "@/lib/alycs";
import { getCanonicalComparisonSlug } from "@/lib/comparisons";
import { formatCommission } from "@/lib/format-commission";
import type { Alyc } from "@/lib/types";

const STORAGE_KEY = "comparador-alycs-selection";
const DEFAULT_IDS = ["iol", "cocos", "balanz", "ppi"];

function loadSelection(): string[] {
  if (typeof window === "undefined") return DEFAULT_IDS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      const valid = parsed.filter((id) => alycs.some((a) => a.id === id));
      if (valid.length > 0) return valid;
    }
  } catch {
    // ignore
  }
  return DEFAULT_IDS;
}

export function ComparisonTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_IDS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSelectedIds(loadSelection());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    }
  }, [selectedIds, hydrated]);

  const selectedAlycs = useMemo(
    () =>
      selectedIds
        .map((id) => alycs.find((a) => a.id === id))
        .filter((a): a is Alyc => a !== undefined),
    [selectedIds],
  );

  const availableToAdd = useMemo(
    () => alycs.filter((a) => !selectedIds.includes(a.id)),
    [selectedIds],
  );

  const addAlyc = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeAlyc = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((item) => item !== id);
    });
  }, []);

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
        Cargando comparación…
      </div>
    );
  }

  return (
    <section id="comparar" className="scroll-mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Comparar comisiones
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Tarifas base sin asesor según tarifarios oficiales. Los valores no
          incluyen IVA ni derechos de mercado.
        </p>
      </div>

      {availableToAdd.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <label htmlFor="add-alyc" className="text-sm font-medium text-zinc-700">
            Agregar ALYC:
          </label>
          <select
            id="add-alyc"
            value=""
            onChange={(e) => {
              if (e.target.value) addAlyc(e.target.value);
            }}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Seleccionar…</option>
            {availableToAdd.map((alyc) => (
              <option key={alyc.id} value={alyc.id}>
                {alyc.shortName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="sticky left-0 z-20 border-r border-zinc-200 bg-zinc-50 px-4 py-3 text-left font-medium text-zinc-700">
                Concepto
              </th>
              {selectedAlycs.map((alyc) => (
                <th
                  key={alyc.id}
                  className="min-w-[120px] px-3 py-3 text-center font-medium text-zinc-700"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <AlycLogo
                        domain={alyc.domain}
                        name={alyc.name}
                        size={20}
                      />
                      <span>{alyc.shortName}</span>
                      {selectedIds.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAlyc(alyc.id)}
                          className="ml-1 rounded-full p-0.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700"
                          aria-label={`Quitar ${alyc.shortName}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4"
                          >
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commissionConcepts.map((concept, idx) => {
              const rowBg = idx % 2 === 0 ? "bg-white" : "bg-zinc-50";
              return (
              <tr key={concept.id} className={rowBg}>
                <td
                  className={`sticky left-0 z-10 border-r border-zinc-200 px-4 py-3 font-medium text-zinc-800 ${rowBg}`}
                >
                  <span title={concept.description}>{concept.label}</span>
                </td>
                {selectedAlycs.map((alyc) => {
                  const rate = alyc.commissions[concept.id] ?? null;
                  return (
                    <td
                      key={alyc.id}
                      className="px-3 py-3 text-center text-zinc-700"
                    >
                      {formatCommission(rate)}
                    </td>
                  );
                })}
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {selectedIds.length === 2 && (
        <p className="mt-4 text-sm">
          <Link
            href={`/${getCanonicalComparisonSlug(selectedIds[0], selectedIds[1])}`}
            className="font-medium text-emerald-700 transition-colors hover:text-emerald-800"
          >
            Ver comparativa completa de {selectedAlycs[0]?.shortName} vs{" "}
            {selectedAlycs[1]?.shortName}
          </Link>
        </p>
      )}
    </section>
  );
}
