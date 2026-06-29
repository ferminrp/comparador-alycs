import { ALYCS } from "@/lib/constants/alycs";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
            Inversiones en Argentina
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Comparador de ALYCs
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Consultá los tarifarios oficiales de los principales agentes de
            liquidación y compensación. Próximamente podrás comparar comisiones
            lado a lado.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <ul className="space-y-4">
          {ALYCS.map((alyc) => (
            <li
              key={alyc.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {alyc.name}
                    {alyc.shortName ? (
                      <span className="ml-2 text-sm font-normal text-slate-500">
                        ({alyc.shortName})
                      </span>
                    ) : null}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">{alyc.description}</p>
                  <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">
                    {alyc.commissionPlaceholder}
                  </p>
                </div>
                <a
                  href={alyc.tarifarioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                >
                  Ver tarifario oficial
                </a>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
          Los enlaces dirigen a los sitios oficiales de cada ALYC. Verificá siempre
          el tarifario vigente antes de operar.
        </div>
      </footer>
    </div>
  );
}
