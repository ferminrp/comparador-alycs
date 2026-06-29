import { AlycLogo } from "@/components/AlycLogo";
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
          <ul className="space-y-4">
            {alycs.map((alyc) => (
              <li
                key={alyc.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <AlycLogo
                        domain={alyc.domain}
                        name={alyc.name}
                        size={36}
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-zinc-900">
                            {alyc.name}
                          </h3>
                          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                            {alyc.shortName}
                          </span>
                        </div>
                      </div>
                    </div>
                    {alyc.notes ? (
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        {alyc.notes}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    <a
                      href={alyc.tarifarioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                      Ver tarifario
                    </a>
                    <a
                      href={alyc.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      Sitio web
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <ComparisonTable />
      </main>

      <SiteFooter />
    </div>
  );
}
