# Comparador de ALYCs

Sitio estático para comparar comisiones y tarifarios de agentes de liquidación y compensación (ALYCs) en Argentina.

## Objetivo

Centralizar enlaces a los tarifarios oficiales de los principales brokers argentinos y, en futuras versiones, permitir comparar comisiones por tipo de operación e instrumento.

## ALYCs incluidos

- Portfolio Personal Inversiones (PPI)
- Balanz
- Cocos Capital
- IEB+
- Inviu
- IOL (InvertirOnline)

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS
- Export estático (`output: 'export'`) para despliegue económico en Vercel u otro hosting estático

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Build estático

```bash
npm run build
```

El sitio exportado queda en la carpeta `out/`.

## Estructura

- `lib/constants/alycs.ts` — datos de cada ALYC (nombre, URL del tarifario, placeholders)
- `app/page.tsx` — landing con listado de brokers

## Próximos pasos

- Cargar comisiones por instrumento (acciones, CEDEARs, bonos, dólar MEP, etc.)
- Tabla comparativa filtrable
- Actualización periódica de tarifarios

## Aviso

Los tarifarios pueden cambiar. Siempre consultá la fuente oficial de cada ALYC antes de invertir.
