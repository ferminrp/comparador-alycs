export type Alyc = {
  id: string;
  name: string;
  shortName?: string;
  tarifarioUrl: string;
  description: string;
  commissionPlaceholder: string;
};

export const ALYCS: Alyc[] = [
  {
    id: "ppi",
    name: "Portfolio Personal Inversiones",
    shortName: "PPI",
    tarifarioUrl: "https://www.portfoliopersonal.com/Contenido/comisiones",
    description: "ALyC integral con plataforma local e internacional (PPI Global).",
    commissionPlaceholder: "Comparación de comisiones próximamente.",
  },
  {
    id: "balanz",
    name: "Balanz",
    tarifarioUrl: "https://balanz.com/comisiones/",
    description: "Sociedad de bolsa con trading online y asesoramiento.",
    commissionPlaceholder: "Comparación de comisiones próximamente.",
  },
  {
    id: "cocos",
    name: "Cocos Capital",
    tarifarioUrl: "https://cocos.capital/tarifario",
    description: "ALyC propio regulado por la CNV con app móvil.",
    commissionPlaceholder: "Comparación de comisiones próximamente.",
  },
  {
    id: "ieb",
    name: "IEB+",
    tarifarioUrl: "https://www.iebmas.com.ar/preguntas-frecuentes/",
    description: "App de inversiones del Grupo IEB con planes por suscripción.",
    commissionPlaceholder: "Comparación de comisiones próximamente.",
  },
  {
    id: "inviu",
    name: "Inviu",
    tarifarioUrl: "https://www.inviu.com.ar/comisiones",
    description: "Plataforma de inversión con asesoramiento personalizado.",
    commissionPlaceholder: "Comparación de comisiones próximamente.",
  },
  {
    id: "iol",
    name: "IOL (InvertirOnline)",
    shortName: "IOL",
    tarifarioUrl: "https://www.invertironline.com/tarifas",
    description: "Broker online líder en Argentina con categorías por volumen.",
    commissionPlaceholder: "Comparación de comisiones próximamente.",
  },
];
