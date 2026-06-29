export type Alyc = {
  id: string;
  name: string;
  shortName: string;
  tarifarioUrl: string;
  websiteUrl: string;
  notes?: string;
};

export const alycs: Alyc[] = [
  {
    id: "ppi",
    name: "Portfolio Personal Inversiones",
    shortName: "PPI",
    tarifarioUrl: "https://www.portfoliopersonal.com/Contenido/comisiones",
    websiteUrl: "https://www.portfoliopersonal.com",
    notes: "Comisiones por operación en pesos y dólares.",
  },
  {
    id: "balanz",
    name: "Balanz",
    shortName: "Balanz",
    tarifarioUrl: "https://www.balanz.com/comisiones",
    websiteUrl: "https://www.balanz.com",
    notes: "Aranceles y comisiones para trading online.",
  },
  {
    id: "cocos",
    name: "Cocos Capital",
    shortName: "Cocos",
    tarifarioUrl: "https://cocos.capital/tarifario",
    websiteUrl: "https://cocos.capital",
    notes: "Incluye planes Gold, Pro y AFI.",
  },
  {
    id: "ieb",
    name: "IEB+ (Invertir en Bolsa)",
    shortName: "IEB+",
    tarifarioUrl:
      "https://www.grupoieb.com.ar/wp-content/uploads/2025/01/ARANCELES-2024-octubre.pdf",
    websiteUrl: "https://www.grupoieb.com.ar/invertirenbolsa/",
    notes: "Tarifario en PDF desde la web de Invertir en Bolsa.",
  },
  {
    id: "inviu",
    name: "Inviu",
    shortName: "Inviu",
    tarifarioUrl:
      "https://s3.amazonaws.com/cms-imgs.dev.inviu.com-ar/Aranceles_Comisiones_202403_ARG_8987c90001.pdf",
    websiteUrl: "https://inviu.lat/ar/",
    notes: "Aranceles y comisiones en PDF (Argentina).",
  },
  {
    id: "iol",
    name: "IOL (InvertirOnline)",
    shortName: "IOL",
    tarifarioUrl: "https://www.invertironline.com/tarifas",
    websiteUrl: "https://www.invertironline.com",
    notes: "Tarifas según volumen operado (Gold, Platinum, Black).",
  },
];
