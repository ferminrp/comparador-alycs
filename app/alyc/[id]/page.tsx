import Link from "next/link";
import { notFound } from "next/navigation";
import { AlycLogo } from "@/components/AlycLogo";
import { AlycReviewsSection } from "@/components/AlycReviewsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { alycs, getAlycById } from "@/lib/alycs";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return alycs.map((alyc) => ({ id: alyc.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const alyc = getAlycById(id);

  if (!alyc) {
    return { title: "ALYC no encontrada" };
  }

  return {
    title: `Reseñas de ${alyc.name} | Comparador ALYC`,
    description: `Leé y escribí reseñas de ${alyc.name}. Iniciá sesión con X para compartir tu experiencia.`,
  };
}

export default async function AlycReviewsPage({ params }: PageProps) {
  const { id } = await params;
  const alyc = getAlycById(id);

  if (!alyc) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-8 sm:px-6">
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-800"
          >
            ← Volver al comparador
          </Link>
        </div>

        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <AlycLogo domain={alyc.domain} name={alyc.name} size={48} />
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-zinc-900">{alyc.name}</h1>
              <p className="mt-1 text-sm text-zinc-600">{alyc.shortName}</p>
              {alyc.notes ? (
                <p className="mt-3 text-sm text-zinc-600">{alyc.notes}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <a
                  href={alyc.tarifarioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-700 hover:text-emerald-800"
                >
                  Ver tarifario
                </a>
                <a
                  href={alyc.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Sitio web
                </a>
              </div>
            </div>
          </div>
        </header>

        <AlycReviewsSection alycId={alyc.id} />
      </main>

      <SiteFooter />
    </div>
  );
}
