"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { Review, ReviewsResponse } from "@/lib/types";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { StarRating } from "./StarRating";

type AlycReviewsSectionProps = {
  alycId: string;
};

export function AlycReviewsSection({ alycId }: AlycReviewsSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState({ averageRating: 0, count: 0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/alycs/${alycId}/reviews`);
      const data = (await response.json()) as ReviewsResponse & { error?: string };

      if (!response.ok) {
        setError(data.error ?? "No se pudieron cargar las reseñas.");
        return;
      }

      setReviews(data.reviews);
      setSummary(data.summary);
      setTotal(data.total);
    } catch {
      setError("Error de red al cargar las reseñas.");
    } finally {
      setLoading(false);
    }
  }, [alycId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const ownReview = session?.user?.id
    ? reviews.find((review) => review.userId === session.user!.id)
    : undefined;

  async function handleDelete(reviewId: string) {
    if (!confirm("¿Eliminar tu reseña?")) return;

    setDeletingId(reviewId);

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        alert(data.error ?? "No se pudo eliminar la reseña.");
        return;
      }

      await loadReviews();
      setEditingReview(null);
    } catch {
      alert("Error de red al eliminar la reseña.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleReviewSuccess(review: Review) {
    setEditingReview(null);
    setReviews((current) => {
      const exists = current.some((item) => item.id === review.id);
      if (exists) {
        return current.map((item) => (item.id === review.id ? review : item));
      }
      return [review, ...current];
    });
    void loadReviews();
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Reseñas</h2>
          {summary.count > 0 ? (
            <div className="mt-1 flex items-center gap-2 text-sm text-zinc-600">
              <StarRating value={Math.round(summary.averageRating)} readOnly size="sm" />
              <span>
                {summary.averageRating.toFixed(1)} · {total} reseña
                {total === 1 ? "" : "s"}
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-zinc-500">
              Todavía no hay reseñas. Sé el primero en compartir tu experiencia.
            </p>
          )}
        </div>
      </div>

      {!ownReview || editingReview ? (
        <ReviewForm
          alycId={alycId}
          existingReview={editingReview}
          onSuccess={handleReviewSuccess}
          onCancelEdit={() => setEditingReview(null)}
        />
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-zinc-100"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-zinc-500">No hay reseñas publicadas todavía.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => {
            const isOwner = review.userId === session?.user?.id;

            return (
              <li key={review.id}>
                <ReviewCard
                  review={review}
                  isOwner={isOwner && !editingReview}
                  onEdit={() => setEditingReview(review)}
                  onDelete={() => void handleDelete(review.id)}
                  isDeleting={deletingId === review.id}
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
