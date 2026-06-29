import { NextResponse } from "next/server";
import { alycs } from "@/lib/alycs";

type ContactPayload =
  | {
      action: "agregar";
      nombre: string;
      dominio: string;
      tarifarioUrl: string;
    }
  | {
      action: "reportar";
      alycId: string;
      descripcion: string;
    };

const DOMAIN_REGEX =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

function isValidDomain(domain: string): boolean {
  if (domain.includes("://") || domain.includes("/")) return false;
  return DOMAIN_REGEX.test(domain);
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function formatMessage(payload: ContactPayload): string {
  if (payload.action === "agregar") {
    return [
      "🆕 Solicitud: Agregar ALYC",
      "",
      `Nombre: ${payload.nombre}`,
      `Dominio: ${payload.dominio}`,
      `Tarifario: ${payload.tarifarioUrl}`,
    ].join("\n");
  }

  const alyc = alycs.find((a) => a.id === payload.alycId);
  return [
    "⚠️ Reporte de error",
    "",
    `ALYC: ${alyc?.name ?? payload.alycId}`,
    "",
    `Descripción:`,
    payload.descripcion,
  ].join("\n");
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { error: "Configuración de Telegram incompleta." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const payload = body as ContactPayload;

  if (payload.action === "agregar") {
    if (!payload.nombre?.trim()) {
      return NextResponse.json(
        { error: "El nombre es obligatorio." },
        { status: 400 },
      );
    }
    if (!payload.dominio?.trim() || !isValidDomain(payload.dominio.trim())) {
      return NextResponse.json(
        {
          error:
            "Dominio inválido. Usá solo el dominio, sin protocolo ni ruta (ej: cocos.capital).",
        },
        { status: 400 },
      );
    }
    if (!payload.tarifarioUrl?.trim() || !isValidUrl(payload.tarifarioUrl.trim())) {
      return NextResponse.json(
        { error: "URL del tarifario inválida. Debe incluir http:// o https://." },
        { status: 400 },
      );
    }
  } else if (payload.action === "reportar") {
    if (!payload.alycId || !alycs.some((a) => a.id === payload.alycId)) {
      return NextResponse.json(
        { error: "Seleccioná una ALYC válida." },
        { status: 400 },
      );
    }
    if (!payload.descripcion?.trim()) {
      return NextResponse.json(
        { error: "La descripción del error es obligatoria." },
        { status: 400 },
      );
    }
  } else {
    return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
  }

  const message = formatMessage(payload);

  const telegramRes = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    },
  );

  if (!telegramRes.ok) {
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje. Intentá de nuevo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
