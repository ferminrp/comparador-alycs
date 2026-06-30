"use client";

import type { Review } from "@/lib/types";
import { StarRating } from "./StarRating";

type ReviewCardProps = {
  review: Review;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function formatFollowers(count: number) {
  return new Intl.NumberFormat("es-AR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count);
}

function ReviewAuthorHeader({ review }: { review: Review }) {
  const avatar = review.userImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={review.userImage}
      alt=""
      className="h-10 w-10 shrink-0 rounded-full"
    />
  ) : (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-500"
      aria-hidden="true"
    >
      {review.userName.charAt(0).toUpperCase()}
    </div>
  );

  const nameLine = (
    <p className="truncate font-medium text-zinc-900">
      {review.userName}
      {review.userFollowersCount != null ? (
        <span className="font-normal text-zinc-500">
          {" "}
          · {formatFollowers(review.userFollowersCount)} seguidores
        </span>
      ) : null}
    </p>
  );

  const meta = (
    <div className="min-w-0">
      {nameLine}
      <p className="text-xs text-zinc-500">{formatDate(review.createdAt)}</p>
    </div>
  );

  if (!review.userXUsername) {
    return (
      <div className="flex min-w-0 items-center gap-3">
        {avatar}
        {meta}
      </div>
    );
  }

  const profileUrl = `https://x.com/${review.userXUsername}`;

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver perfil de ${review.userName} en X`}
      className="group flex min-w-0 items-center gap-3 rounded-lg outline-offset-2 transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
    >
      <span className="shrink-0 transition-opacity group-hover:opacity-80">
        {avatar}
      </span>
      <div className="min-w-0">
        <p className="truncate font-medium text-zinc-900 group-hover:underline">
          {review.userName}
          {review.userFollowersCount != null ? (
            <span className="font-normal text-zinc-500 no-underline">
              {" "}
              · {formatFollowers(review.userFollowersCount)} seguidores
            </span>
          ) : null}
        </p>
        <p className="text-xs text-zinc-500">{formatDate(review.createdAt)}</p>
      </div>
    </a>
  );
}

export function ReviewCard({
  review,
  isOwner = false,
  onEdit,
  onDelete,
  isDeleting = false,
}: ReviewCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <ReviewAuthorHeader review={review} />
        <StarRating value={review.rating} readOnly size="sm" />
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
        {review.body}
      </p>

      {isOwner ? (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-md px-2 py-1 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="rounded-md px-2 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {isDeleting ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      ) : null}
    </article>
  );
}
