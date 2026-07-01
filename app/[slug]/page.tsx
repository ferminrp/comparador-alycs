import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AlycCommissionTable } from "@/components/AlycCommissionTable";
import { AlycLogo } from "@/components/AlycLogo";
import { AlycReviewsSection } from "@/components/AlycReviewsSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import {
  AlycRelatedLinks,
  ComparisonRelatedLinks,
} from "@/components/RelatedLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAlycById } from "@/lib/alycs";
import {
  getAllPageSlugs,
  isCanonicalComparisonSlug,
  parseSlug,
} from "@/lib/comparisons";
import {
  buildAlycFaqs,
  buildAlycIntro,
  buildComparisonFaqs,
  buildComparisonSummary,
} from "@/lib/seo-content";
import {
  buildAlycMetadata,
  buildBreadcrumbJsonLd,
  buildComparisonMetadata,
  buildFaqJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) return {};

  if (parsed.type === "alyc") {
    const alyc = getAlycById(parsed.id);
    if (!alyc) return {};
    return buildAlycMetadata(alyc);
  }

  const alycA = getAlycById(parsed.idA);
  const alycB = getAlycById(parsed.idB);
  if (!alycA || !alycB) return {};

  return buildComparisonMetadata(alycA, alycB);
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) notFound();

  if (parsed.type === "comparison" && !isCanonicalComparisonSlug(slug)) {
    redirect(`/${parsed.slug}`);
  }

  if (parsed.type === "alyc") {
    const alyc = getAlycById(parsed.id);
    if (!alyc) notFound();

    const intro = buildAlycIntro(alyc);
    const faqs = buildAlycFaqs(alyc);
    const breadcrumbs = [
      { name: "Inicio", href: "/" },
      { name: alyc.shortName, href: `/${alyc.id}` },
    ];

    return (
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mb-8 flex items-start gap-4">
            <AlycLogo domain={alyc.domain} name={alyc.name} size={48} />
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                Comisiones de {alyc.name}
              </h1>
              {alyc.notes && (
                <p className="mt-2 text-sm text-zinc-600">{alyc.notes}</p>
              )}
            </div>
          </div>

          <p className="mb-8 text-base leading-7 text-zinc-700">{intro}</p>

          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900">
              Tabla de comisiones
            </h2>
            <p className="mb-4 text-sm text-zinc-600">
              Tarifas base sin asesor según tarifarios oficiales. Los valores no
              incluyen IVA ni derechos de mercado.
            </p>
            <AlycCommissionTable alycIds={[alyc.id]} />
          </section>

          <div className="mb-10 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="text-sm text-emerald-900">
              ¿Querés estimar cuánto pagarías según el monto? Usá la{" "}
              <Link
                href="/#calculadora"
                className="font-medium underline underline-offset-2"
              >
                calculadora de comisiones
              </Link>
              .
            </p>
          </div>

          <div className="mb-10">
            <AlycRelatedLinks alyc={alyc} />
          </div>

          <div id="reseñas" className="mb-10 scroll-mt-20">
            <AlycReviewsSection alycId={alyc.id} />
          </div>

          <FaqSection faqs={faqs} />
        </main>
        <SiteFooter />

        <JsonLd
          data={[
            buildWebPageJsonLd({
              name: `Comisiones de ${alyc.name}`,
              description: intro,
              path: `/${alyc.id}`,
            }),
            buildBreadcrumbJsonLd(breadcrumbs),
            buildFaqJsonLd(faqs),
          ]}
        />
      </div>
    );
  }

  const alycA = getAlycById(parsed.idA);
  const alycB = getAlycById(parsed.idB);
  if (!alycA || !alycB) notFound();

  const summary = buildComparisonSummary(alycA, alycB);
  const faqs = buildComparisonFaqs(alycA, alycB);
  const breadcrumbs = [
    { name: "Inicio", href: "/" },
    {
      name: `${alycA.shortName} vs ${alycB.shortName}`,
      href: `/${parsed.slug}`,
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <AlycLogo domain={alycA.domain} name={alycA.name} size={40} />
            <span className="text-lg font-medium text-zinc-400">vs</span>
            <AlycLogo domain={alycB.domain} name={alycB.name} size={40} />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-zinc-900">
          {alycA.shortName} vs {alycB.shortName}: comparativa de comisiones
        </h1>

        <p className="mb-8 text-base leading-7 text-zinc-700">{summary}</p>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900">
            Comparación lado a lado
          </h2>
          <AlycCommissionTable alycIds={[alycA.id, alycB.id]} />
        </section>

        <div className="mb-10 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="text-sm text-emerald-900">
            Calculá el costo exacto según tu monto en la{" "}
            <Link
              href="/#calculadora"
              className="font-medium underline underline-offset-2"
            >
              calculadora de comisiones
            </Link>
            .
          </p>
        </div>

        <div className="mb-10">
          <ComparisonRelatedLinks
            alycA={alycA}
            alycB={alycB}
            currentSlug={parsed.slug}
          />
        </div>

        <FaqSection faqs={faqs} />
      </main>
      <SiteFooter />

      <JsonLd
        data={[
          buildWebPageJsonLd({
            name: `${alycA.shortName} vs ${alycB.shortName}: comparativa de comisiones`,
            description: summary,
            path: `/${parsed.slug}`,
          }),
          buildBreadcrumbJsonLd(breadcrumbs),
          buildFaqJsonLd(faqs),
        ]}
      />
    </div>
  );
}
