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

El sitio corre en http://localhost:3000. Para reseñas y login con X necesitás configurar las variables de entorno (ver `.env.example`).

## Build

```bash
npm run build
npm start
```

El proyecto usa rutas API (contacto, auth, reseñas) y requiere despliegue en modo servidor (por ejemplo Vercel), no export estático puro.

## Reseñas de ALYCs

Cada broker tiene una página `/alyc/[id]` donde los usuarios pueden leer y escribir reseñas. Para publicar hay que iniciar sesión con X (Twitter) vía NextAuth. Las reseñas se guardan en Upstash Redis.

Configuración necesaria:

1. **X Developer Portal**: app con OAuth 2.0, callback `https://tu-dominio.com/api/auth/callback/twitter`
2. **Upstash**: base Redis con REST API habilitada
3. **AUTH_SECRET**: generá uno con `openssl rand -base64 32`

## Calculadora de comisiones

Sección `#calculadora` en la home: ingresá monto e instrumento y compará la comisión estimada por operación en las 6 ALYC (ordenadas de menor a mayor costo).

## Próximos pasos

- Historial de cambios de tarifarios
- Calculadora de cauciones con plazo en días
