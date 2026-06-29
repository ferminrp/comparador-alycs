export type CommissionUnit = "percent" | "fixed" | "tna";

export type CommissionRate = {
  rate: number;
  unit: CommissionUnit;
  minimum?: number;
  minimumCurrency?: "ARS" | "USD";
  notes?: string;
  source?: "tarifario" | "estimado";
  lastUpdated?: string;
};

export type Alyc = {
  id: string;
  name: string;
  shortName: string;
  domain: string;
  tarifarioUrl: string;
  websiteUrl: string;
  notes?: string;
  commissions: Record<string, CommissionRate | null>;
};

export type CommissionConcept = {
  id: string;
  label: string;
  description: string;
};

export type AlycsData = {
  alycs: Alyc[];
  commissionConcepts: CommissionConcept[];
};
