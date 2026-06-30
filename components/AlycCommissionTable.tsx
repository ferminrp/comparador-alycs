import { AlycLogo } from "@/components/AlycLogo";
import { alycs, commissionConcepts } from "@/lib/alycs";
import { formatCommission } from "@/lib/format-commission";
import type { Alyc } from "@/lib/types";

type AlycCommissionTableProps = {
  alycIds: string[];
};

export function AlycCommissionTable({ alycIds }: AlycCommissionTableProps) {
  const selectedAlycs = alycIds
    .map((id) => alycs.find((alyc) => alyc.id === id))
    .filter((alyc): alyc is Alyc => alyc !== undefined);

  if (selectedAlycs.length === 0) return null;

  return (
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
                  <AlycLogo domain={alyc.domain} name={alyc.name} size={20} />
                  <span>{alyc.shortName}</span>
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
  );
}
