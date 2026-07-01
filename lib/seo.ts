import type { Metadata } from "next";
import type { Alyc } from "@/lib/types";
import { getCanonicalComparisonSlug } from "@/lib/comparisons";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://comparador-alycs.vercel.app";

export const SITE_NAME = "Comparador ALYC";

const CURRENT_YEAR = new Date().getFullYear();

export type BreadcrumbItem = {
  name: string;
  href: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function buildAlycMetadata(alyc: Alyc): Metadata {
  const title = `Comisiones ${alyc.shortName} ${CURRENT_YEAR}: tarifario y aranceles`;
  const description = `Consultá las comisiones de ${alyc.name} en acciones, bonos, opciones, MEP y más. Datos del tarifario oficial actualizado. Leé reseñas de usuarios y compará con otros brokers de Argentina.`;
  const path = `/${alyc.id}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type: "website",
      locale: "es_AR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildComparisonMetadata(alycA: Alyc, alycB: Alyc): Metadata {
  const slug = getCanonicalComparisonSlug(alycA.id, alycB.id);
  const [first, second] =
    slug.split("-vs-")[0] === alycA.id
      ? [alycA, alycB]
      : [alycB, alycA];

  const title = `${first.shortName} vs ${second.shortName}: comparativa de comisiones ${CURRENT_YEAR}`;
  const description = `Compará lado a lado las comisiones de ${first.name} y ${second.name} en acciones, bonos, MEP, cauciones y más. Datos del tarifario oficial.`;
  const path = `/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type: "website",
      locale: "es_AR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildWebPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "es-AR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function buildFaqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
