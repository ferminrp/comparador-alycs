"use client";

import { useState } from "react";
import { alycs } from "@/lib/alycs";

type Action = "agregar" | "reportar" | null;

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

export function ContactForm() {
  const [action, setAction] = useState<Action>(null);
  const [nombre, setNombre] = useState("");
  const [dominio, setDominio] = useState("");
  const [tarifarioUrl, setTarifarioUrl] = useState("");
  const [alycId, setAlycId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dominioError, setDominioError] = useState("");
  const [tarifarioError, setTarifarioError] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setDominioError("");
    setTarifarioError("");

    if (!action) return;

    if (action === "agregar") {
      if (!isValidDomain(dominio.trim())) {
        setDominioError(
          "Dominio inválido. Usá solo el dominio, sin protocolo ni ruta (ej: cocos.capital).",
        );
        return;
      }
      if (!isValidUrl(tarifarioUrl.trim())) {
        setTarifarioError(
          "URL inválida. Debe incluir http:// o https://.",
        );
        return;
      }
    }

    setStatus("loading");

    const body =
      action === "agregar"
        ? {
            action: "agregar" as const,
            nombre: nombre.trim(),
            dominio: dominio.trim(),
            tarifarioUrl: tarifarioUrl.trim(),
          }
        : {
            action: "reportar" as const,
            alycId,
            descripcion: descripcion.trim(),
          };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Ocurrió un error. Intentá de nuevo.");
        return;
      }

      setStatus("success");
      setNombre("");
      setDominio("");
      setTarifarioUrl("");
      setAlycId("");
      setDescripcion("");
      setAction(null);
    } catch {
      setStatus("error");
      setErrorMessage("Error de conexión. Intentá de nuevo.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-medium text-emerald-800">
          ¡Mensaje enviado! Gracias por tu aporte.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-emerald-700 underline hover:text-emerald-900"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset>
        <legend className="text-base font-medium text-zinc-900">
          ¿Qué querés hacer?
        </legend>
        <div className="mt-3 space-y-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-emerald-300">
            <input
              type="radio"
              name="action"
              value="agregar"
              checked={action === "agregar"}
              onChange={() => setAction("agregar")}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-800">Agregar una ALYC</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-emerald-300">
            <input
              type="radio"
              name="action"
              value="reportar"
              checked={action === "reportar"}
              onChange={() => setAction("reportar")}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-800">Reportar un error</span>
          </label>
        </div>
      </fieldset>

      {action === "agregar" && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-zinc-700"
            >
              Nombre de la ALYC
            </label>
            <input
              id="nombre"
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Ej: Bull Market Brokers"
            />
          </div>
          <div>
            <label
              htmlFor="dominio"
              className="block text-sm font-medium text-zinc-700"
            >
              Dominio
            </label>
            <input
              id="dominio"
              type="text"
              required
              value={dominio}
              onChange={(e) => {
                setDominio(e.target.value);
                setDominioError("");
              }}
              className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-1 ${
                dominioError
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-200 focus:border-emerald-500 focus:ring-emerald-500"
              }`}
              placeholder="cocos.capital"
            />
            {dominioError && (
              <p className="mt-1 text-sm text-red-600">{dominioError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="tarifarioUrl"
              className="block text-sm font-medium text-zinc-700"
            >
              URL del tarifario
            </label>
            <input
              id="tarifarioUrl"
              type="url"
              required
              value={tarifarioUrl}
              onChange={(e) => {
                setTarifarioUrl(e.target.value);
                setTarifarioError("");
              }}
              className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-1 ${
                tarifarioError
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-200 focus:border-emerald-500 focus:ring-emerald-500"
              }`}
              placeholder="https://ejemplo.com/tarifario"
            />
            {tarifarioError && (
              <p className="mt-1 text-sm text-red-600">{tarifarioError}</p>
            )}
          </div>
        </div>
      )}

      {action === "reportar" && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="alycId"
              className="block text-sm font-medium text-zinc-700"
            >
              ALYC
            </label>
            <select
              id="alycId"
              required
              value={alycId}
              onChange={(e) => setAlycId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Seleccionar…</option>
              {alycs.map((alyc) => (
                <option key={alyc.id} value={alyc.id}>
                  {alyc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-zinc-700"
            >
              Descripción del error
            </label>
            <textarea
              id="descripcion"
              required
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Describí qué dato está incorrecto y, si podés, la fuente correcta."
            />
          </div>
        </div>
      )}

      {status === "error" && errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      {action && (
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? "Enviando…" : "Enviar"}
        </button>
      )}
    </form>
  );
}
