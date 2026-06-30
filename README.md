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

### Configurar X (Twitter) Developer Portal

La URL del callback **es correcta**:

```
https://alycs.ar/api/auth/callback/twitter
```

Si el portal dice *"not a valid callback URI"*, casi siempre es por **dónde** se pega, no por la URL en sí. Seguí estos pasos en orden:

1. Entrá a [console.x.com](https://console.x.com) → tu **Project** → tu **App**.
2. Buscá la sección **User authentication settings** (no confundir con "API Key & Secret" de OAuth 1.0a).
3. Si dice "Set up", hacé clic y **activá OAuth 2.0**.
4. Configurá:
   - **App permissions**: `Read` (alcanza para login)
   - **Type of App**: `Web App, Automated App or Bot` (no "Native App")
   - **Website URL**: `https://alycs.ar`
   - **Callback URI / Redirect URL**: `https://alycs.ar/api/auth/callback/twitter`
5. Completá **Privacy Policy** y **Terms of Service** si el formulario los pide (a veces el botón Save queda deshabilitado sin ellos). Podés usar `https://alycs.ar` temporalmente si no tenés páginas dedicadas.
6. Guardá y copiá el **Client ID** y **Client Secret** de OAuth 2.0 (no uses API Key / API Secret de OAuth 1.0a).

**Errores comunes:**

| Problema | Solución |
|----------|----------|
| "Not a valid callback URI" | Estás en OAuth 1.0a o en el lugar equivocado. Usá **User authentication settings → OAuth 2.0**. |
| Botón Save grisado | Revisá espacios al inicio/fin de la URL, Website URL inválida, o faltan Privacy/Terms. |
| Login falla después de guardar | La URL debe coincidir **exactamente** (sin `/` final). Usá `https://`, no `http://`, en producción. |
| Credenciales no funcionan | En Vercel usá `AUTH_TWITTER_ID` / `AUTH_TWITTER_SECRET` del Client ID/Secret de OAuth 2.0. |

**Desarrollo local** (X no acepta `localhost` en algunos casos; probá con `127.0.0.1`):

```
Website URL:    http://127.0.0.1:3000
Callback URI:   http://127.0.0.1:3000/api/auth/callback/twitter
```

Y en `.env.local`:

```
AUTH_URL=http://127.0.0.1:3000
```

### Variables de entorno (producción en Vercel)

| Variable | Valor |
|----------|-------|
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_TWITTER_ID` | Client ID de OAuth 2.0 |
| `AUTH_TWITTER_SECRET` | Client Secret de OAuth 2.0 |
| `UPSTASH_REDIS_REST_URL` | URL REST de Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Token REST de Upstash |

**Importante:** el callback solo funciona cuando el código con `/api/auth/[...nextauth]` está desplegado en `alycs.ar`. Si la ruta devuelve 404, mergeá y desplegá el PR de reseñas antes de probar el login.

## Calculadora de comisiones

Sección `#calculadora` en la home: ingresá monto e instrumento y compará la comisión estimada por operación en las 6 ALYC (ordenadas de menor a mayor costo).

## Próximos pasos

- Historial de cambios de tarifarios
- Calculadora de cauciones con plazo en días
