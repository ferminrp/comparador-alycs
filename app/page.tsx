import { AlycLogo } from "@/components/AlycLogo";
import { CommissionCalculator } from "@/components/CommissionCalculator";
import { ComparisonTable } from "@/components/ComparisonTable";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { alycs } from "@/lib/alycs";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            Argentina
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Comparador de comisiones ALYC
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Listado de brokers con links a sus tarifarios oficiales y
            comparación de comisiones por instrumento.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-12 px-4 py-8 sm:px-6">
        <section>
          <h2 className="mb-4 text-xl font-semibold text-zinc-900">
            Brokers disponibles
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th
                    scope="col"
                    className="w-12 px-4 py-2.5 text-left font-medium text-zinc-500"
                  >
                    <span className="sr-only">Logo</span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left font-medium text-zinc-700"
                  >
                    Nombre
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-2.5 text-left font-medium text-zinc-700 sm:table-cell"
                  >
                    Notas
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2.5 text-right font-medium text-zinc-700"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {alycs.map((alyc) => (
                  <tr key={alyc.id} className="bg-white">
                    <td className="px-4 py-2.5">
                      <AlycLogo
                        domain={alyc.domain}
                        name={alyc.name}
                        size={28}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="font-medium text-zinc-900">
                          {alyc.name}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                          {alyc.shortName}
                        </span>
                      </div>
                      {alyc.notes ? (
                        <p
                          className="mt-0.5 truncate text-xs text-zinc-500 sm:hidden"
                          title={alyc.notes}
                        >
                          {alyc.notes}
                        </p>
                      ) : null}
                    </td>
                    <td className="hidden max-w-xs px-3 py-2.5 text-zinc-600 sm:table-cell">
                      {alyc.notes ? (
                        <span className="line-clamp-2" title={alyc.notes}>
                          {alyc.notes}
                        </span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={alyc.tarifarioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md px-2 py-1 font-medium text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          Tarifario
                        </a>
                        <span className="text-zinc-300" aria-hidden="true">
                          ·
                        </span>
                        <a
                          href={alyc.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md px-2 py-1 font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                        >
                          Web
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ComparisonTable />

        <CommissionCalculator />
      </main>

      <SiteFooter />
    </div>
  );
}
