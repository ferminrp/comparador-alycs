import Link from "next/link";
import { alycs } from "@/lib/alycs";
import {
  FEATURED_COMPARISONS,
  getComparisonsForAlyc,
  parseComparisonSlug,
} from "@/lib/comparisons";
import type { Alyc } from "@/lib/types";

type AlycRelatedLinksProps = {
  alyc: Alyc;
};

export function AlycRelatedLinks({ alyc }: AlycRelatedLinksProps) {
  const comparisons = getComparisonsForAlyc(alyc.id);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-semibold text-zinc-900">
          Comparar {alyc.shortName} con otros brokers
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {comparisons.map((pair) => {
            const otherId = pair.idA === alyc.id ? pair.idB : pair.idA;
            const other = alycs.find((item) => item.id === otherId);
            if (!other) return null;

            return (
              <li key={pair.slug}>
                <Link
                  href={`/${pair.slug}`}
                  className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  {alyc.shortName} vs {other.shortName}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={alyc.tarifarioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
        >
          Ver tarifario oficial
        </a>
        <a
          href={alyc.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Sitio web de {alyc.shortName}
        </a>
      </div>
    </section>
  );
}

type ComparisonRelatedLinksProps = {
  alycA: Alyc;
  alycB: Alyc;
  currentSlug: string;
};

export function ComparisonRelatedLinks({
  alycA,
  alycB,
  currentSlug,
}: ComparisonRelatedLinksProps) {
  const relatedSlugs = new Set<string>();

  for (const pair of getComparisonsForAlyc(alycA.id)) {
    if (pair.slug !== currentSlug) relatedSlugs.add(pair.slug);
  }
  for (const pair of getComparisonsForAlyc(alycB.id)) {
    if (pair.slug !== currentSlug) relatedSlugs.add(pair.slug);
  }

  const related = [...relatedSlugs].slice(0, 6);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-semibold text-zinc-900">
          Fichas individuales
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[alycA, alycB].map((alyc) => (
            <li key={alyc.id}>
              <Link
                href={`/${alyc.id}`}
                className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
              >
                Comisiones de {alyc.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            Otras comparativas relacionadas
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((slug) => {
              const parsed = parseComparisonSlug(slug);
              if (!parsed) return null;
              const [idA, idB] = parsed;
              const a = alycs.find((item) => item.id === idA);
              const b = alycs.find((item) => item.id === idB);
              if (!a || !b) return null;

              return (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    {a.shortName} vs {b.shortName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

export function FeaturedComparisons() {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-zinc-900">
        Comparativas populares
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_COMPARISONS.map((slug) => {
          const parsed = parseComparisonSlug(slug);
          if (!parsed) return null;
          const [idA, idB] = parsed;
          const a = alycs.find((item) => item.id === idA);
          const b = alycs.find((item) => item.id === idB);
          if (!a || !b) return null;

          return (
            <li key={slug}>
              <Link
                href={`/${slug}`}
                className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {a.shortName} vs {b.shortName}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function FooterBrokerLinks() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-700">Brokers</h3>
        <ul className="space-y-1">
          {alycs.map((alyc) => (
            <li key={alyc.id}>
              <Link
                href={`/${alyc.id}`}
                className="text-zinc-500 transition-colors hover:text-emerald-700"
              >
                Comisiones {alyc.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-700">
          Comparativas
        </h3>
        <ul className="space-y-1">
          {FEATURED_COMPARISONS.map((slug) => {
            const parsed = parseComparisonSlug(slug);
            if (!parsed) return null;
            const [idA, idB] = parsed;
            const a = alycs.find((item) => item.id === idA);
            const b = alycs.find((item) => item.id === idB);
            if (!a || !b) return null;

            return (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="text-zinc-500 transition-colors hover:text-emerald-700"
                >
                  {a.shortName} vs {b.shortName}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
