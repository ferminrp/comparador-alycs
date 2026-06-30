import { alycs } from "@/lib/alycs";

/** Higher number = listed first in comparison URLs (e.g. /iol-vs-ieb). */
export const COMPARISON_PRIORITY: Record<string, number> = {
  iol: 7,
  ppi: 6,
  balanz: 5,
  cocos: 4,
  inviu: 3,
  ieb: 2,
  allaria: 1,
};

const COMPARISON_SEPARATOR = "-vs-";

export type ComparisonPair = {
  idA: string;
  idB: string;
  slug: string;
};

export function getComparisonPriority(id: string): number {
  return COMPARISON_PRIORITY[id] ?? 0;
}

export function orderComparisonIds(idA: string, idB: string): [string, string] {
  const priorityA = getComparisonPriority(idA);
  const priorityB = getComparisonPriority(idB);

  if (priorityA !== priorityB) {
    return priorityA > priorityB ? [idA, idB] : [idB, idA];
  }

  return idA.localeCompare(idB) <= 0 ? [idA, idB] : [idB, idA];
}

export function getCanonicalComparisonSlug(idA: string, idB: string): string {
  const [first, second] = orderComparisonIds(idA, idB);
  return `${first}${COMPARISON_SEPARATOR}${second}`;
}

export function parseComparisonSlug(slug: string): [string, string] | null {
  const separatorIndex = slug.indexOf(COMPARISON_SEPARATOR);
  if (separatorIndex === -1) return null;

  const idA = slug.slice(0, separatorIndex);
  const idB = slug.slice(separatorIndex + COMPARISON_SEPARATOR.length);

  if (!idA || !idB) return null;

  const validIds = new Set(alycs.map((alyc) => alyc.id));
  if (!validIds.has(idA) || !validIds.has(idB) || idA === idB) return null;

  return [idA, idB];
}

export function isCanonicalComparisonSlug(slug: string): boolean {
  const parsed = parseComparisonSlug(slug);
  if (!parsed) return false;

  const [idA, idB] = parsed;
  const canonical = getCanonicalComparisonSlug(idA, idB);
  return slug === canonical;
}

export function getAllComparisonPairs(): ComparisonPair[] {
  const pairs: ComparisonPair[] = [];

  for (let i = 0; i < alycs.length; i++) {
    for (let j = i + 1; j < alycs.length; j++) {
      const idA = alycs[i].id;
      const idB = alycs[j].id;
      pairs.push({
        idA,
        idB,
        slug: getCanonicalComparisonSlug(idA, idB),
      });
    }
  }

  return pairs;
}

export function getComparisonsForAlyc(id: string): ComparisonPair[] {
  return getAllComparisonPairs().filter(
    (pair) => pair.idA === id || pair.idB === id,
  );
}

/** Popular comparison pairs for homepage/footer links. */
export const FEATURED_COMPARISONS = [
  "iol-vs-ieb",
  "iol-vs-cocos",
  "iol-vs-ppi",
  "ppi-vs-cocos",
  "balanz-vs-ieb",
  "iol-vs-balanz",
] as const;

export type SlugType =
  | { type: "alyc"; id: string }
  | { type: "comparison"; idA: string; idB: string; slug: string };

export function parseSlug(slug: string): SlugType | null {
  const comparison = parseComparisonSlug(slug);
  if (comparison) {
    const [idA, idB] = comparison;
    return {
      type: "comparison",
      idA,
      idB,
      slug: getCanonicalComparisonSlug(idA, idB),
    };
  }

  const alyc = alycs.find((item) => item.id === slug);
  if (alyc) {
    return { type: "alyc", id: alyc.id };
  }

  return null;
}

export function getAllPageSlugs(): string[] {
  const alycSlugs = alycs.map((alyc) => alyc.id);
  const comparisonSlugs = getAllComparisonPairs().map((pair) => pair.slug);
  return [...alycSlugs, ...comparisonSlugs];
}
