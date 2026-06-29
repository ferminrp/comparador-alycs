# Comparador de comisiones ALYC

Sitio estático para comparar comisiones de brokers (ALYC) en Argentina.

## ALYCs incluidas

| Broker | Tarifario |
| --- | --- |
| Portfolio Personal Inversiones (PPI) | [portfoliopersonal.com/Contenido/comisiones](https://www.portfoliopersonal.com/Contenido/comisiones) |
| Balanz | [balanz.com/comisiones](https://www.balanz.com/comisiones) |
| Cocos Capital | [cocos.capital/tarifario](https://cocos.capital/tarifario) |
| IEB+ (Invertir en Bolsa) | [PDF de aranceles](https://www.grupoieb.com.ar/wp-content/uploads/2025/01/ARANCELES-2024-octubre.pdf) |
| Inviu | [PDF de aranceles](https://s3.amazonaws.com/cms-imgs.dev.inviu.com-ar/Aranceles_Comisiones_202403_ARG_8987c90001.pdf) |
| IOL (InvertirOnline) | [invertironline.com/tarifas](https://www.invertironline.com/tarifas) |

## Desarrollo

```bash
npm install
npm run dev
```

## Build estático

El proyecto usa `output: "export"` para generar HTML estático y minimizar costos en Vercel.

```bash
npm run build
```

La salida queda en `out/`.

## Calculadora de comisiones

Sección `#calculadora` en la home: ingresá monto e instrumento y compará la comisión estimada por operación en las 6 ALYC (ordenadas de menor a mayor costo).

## Próximos pasos

- Historial de cambios de tarifarios
- Calculadora de cauciones con plazo en días
