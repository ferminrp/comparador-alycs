"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import type { Review } from "@/lib/types";
import { StarRating } from "./StarRating";

type ReviewFormProps = {
  alycId: string;
  existingReview?: Review | null;
  onSuccess: (review: Review) => void;
  onCancelEdit?: () => void;
};

export function ReviewForm({
  alycId,
  existingReview,
  onSuccess,
  onCancelEdit,
}: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = Boolean(existingReview);

  if (!session?.user) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
        <p className="text-sm text-zinc-600">
          Para dejar una reseña tenés que iniciar sesión con tu cuenta de X.
        </p>
        <button
          type="button"
          onClick={() => signIn("twitter")}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Ingresar con X
        </button>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    if (rating < 1) {
      setErrorMessage("Seleccioná una calificación de 1 a 5 estrellas.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    const url = isEditing
      ? `/api/reviews/${existingReview!.id}`
      : `/api/alycs/${alycId}/reviews`;
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, body }),
      });

      const data = (await response.json()) as { review?: Review; error?: string };

      if (!response.ok) {
        setErrorMessage(data.error ?? "No se pudo guardar la reseña.");
        setStatus("error");
        return;
      }

      if (data.review) {
        onSuccess(data.review);
        if (!isEditing) {
          setBody("");
          setRating(0);
        }
      }

      setStatus("idle");
    } catch {
      setErrorMessage("Error de red. Intentá de nuevo.");
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <h3 className="text-base font-semibold text-zinc-900">
        {isEditing ? "Editar tu reseña" : "Escribir una reseña"}
      </h3>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Calificación
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div className="mt-4">
        <label htmlFor="review-body" className="mb-2 block text-sm font-medium text-zinc-700">
          Tu experiencia
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="Contá cómo fue tu experiencia con este broker: atención, plataforma, costos ocultos, etc."
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          required
        />
        <p className="mt-1 text-xs text-zinc-500">{body.length}/2000</p>
      </div>

      {status === "error" && errorMessage ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          {status === "loading"
            ? "Guardando…"
            : isEditing
              ? "Guardar cambios"
              : "Publicar reseña"}
        </button>
        {isEditing && onCancelEdit ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
