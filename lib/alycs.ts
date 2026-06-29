import alycsData from "@/data/alycs.json";
import type { Alyc, AlycsData, CommissionConcept } from "@/lib/types";

const data = alycsData as AlycsData;

export const alycs: Alyc[] = data.alycs;
export const commissionConcepts: CommissionConcept[] = data.commissionConcepts;

export function getAlycById(id: string): Alyc | undefined {
  return alycs.find((alyc) => alyc.id === id);
}

export function getFaviconUrl(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}
