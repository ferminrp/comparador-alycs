"use client";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
};

const sizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
};

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md",
}: StarRatingProps) {
  const starSize = sizes[size];

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role={readOnly ? "img" : "radiogroup"}
      aria-label={readOnly ? `Calificación: ${value} de 5` : "Calificación"}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;

        if (readOnly) {
          return (
            <svg
              key={star}
              viewBox="0 0 20 20"
              className={`${starSize} ${filled ? "text-amber-400" : "text-zinc-200"}`}
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`rounded p-0.5 transition-colors hover:text-amber-400 ${filled ? "text-amber-400" : "text-zinc-300"}`}
            aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
          >
            <svg viewBox="0 0 20 20" className={starSize} aria-hidden="true">
              <path
                fill="currentColor"
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
