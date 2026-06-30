import { getRedis } from "@/lib/redis";
import type { Review, ReviewSummary, ReviewsResponse } from "@/lib/types";

const MAX_BODY_LENGTH = 2000;
const MIN_BODY_LENGTH = 10;

function reviewKey(id: string) {
  return `review:${id}`;
}

function alycReviewsKey(alycId: string) {
  return `alyc:${alycId}:reviews`;
}

function userAlycReviewKey(userId: string, alycId: string) {
  return `user:${userId}:alyc:${alycId}:review`;
}

function alycRatingSumKey(alycId: string) {
  return `alyc:${alycId}:rating:sum`;
}

function alycRatingCountKey(alycId: string) {
  return `alyc:${alycId}:rating:count`;
}

async function getReviewSummary(alycId: string): Promise<ReviewSummary> {
  const redis = getRedis();
  const [sum, count] = await redis.mget(
    alycRatingSumKey(alycId),
    alycRatingCountKey(alycId),
  );

  const totalCount = Number(count ?? 0);
  const totalSum = Number(sum ?? 0);

  return {
    count: totalCount,
    averageRating:
      totalCount > 0 ? Math.round((totalSum / totalCount) * 10) / 10 : 0,
  };
}

export function validateReviewInput(rating: unknown, body: unknown): string | null {
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return "La calificación debe ser un número entre 1 y 5.";
  }

  if (typeof body !== "string") {
    return "El texto de la reseña es obligatorio.";
  }

  const trimmed = body.trim();
  if (trimmed.length < MIN_BODY_LENGTH) {
    return `La reseña debe tener al menos ${MIN_BODY_LENGTH} caracteres.`;
  }

  if (trimmed.length > MAX_BODY_LENGTH) {
    return `La reseña no puede superar ${MAX_BODY_LENGTH} caracteres.`;
  }

  return null;
}

export async function listReviewsByAlyc(
  alycId: string,
  limit = 20,
  offset = 0,
): Promise<ReviewsResponse> {
  const redis = getRedis();
  const indexKey = alycReviewsKey(alycId);

  const total = await redis.zcard(indexKey);
  const reviewIds = await redis.zrange<string[]>(
    indexKey,
    offset,
    offset + limit - 1,
    { rev: true },
  );

  if (reviewIds.length === 0) {
    const summary = await getReviewSummary(alycId);
    return {
      reviews: [],
      summary,
      total,
    };
  }

  const pipeline = redis.pipeline();
  for (const id of reviewIds) {
    pipeline.get(reviewKey(id));
  }
  const results = await pipeline.exec<(Review | null)[]>();

  const reviews = results.filter((review): review is Review => review !== null);
  const summary = await getReviewSummary(alycId);

  return { reviews, summary, total };
}

export async function getReviewById(id: string): Promise<Review | null> {
  const redis = getRedis();
  return redis.get<Review>(reviewKey(id));
}

export async function getUserReviewForAlyc(
  userId: string,
  alycId: string,
): Promise<Review | null> {
  const redis = getRedis();
  const reviewId = await redis.get<string>(userAlycReviewKey(userId, alycId));
  if (!reviewId) {
    return null;
  }
  return getReviewById(reviewId);
}

type ReviewAuthor = {
  id: string;
  name?: string | null;
  image?: string | null;
};

export async function createReview(
  alycId: string,
  author: ReviewAuthor,
  rating: number,
  body: string,
): Promise<Review> {
  const redis = getRedis();
  const now = new Date().toISOString();
  const review: Review = {
    id: crypto.randomUUID(),
    alycId,
    userId: author.id,
    userName: author.name ?? "Usuario de X",
    userImage: author.image ?? undefined,
    rating,
    body: body.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const score = Date.parse(now);
  const userKey = userAlycReviewKey(author.id, alycId);
  const claimed = await redis.set(userKey, review.id, { nx: true });

  if (!claimed) {
    throw new Error("Ya publicaste una reseña para esta ALYC.");
  }

  try {
    await redis
      .pipeline()
      .set(reviewKey(review.id), review)
      .zadd(alycReviewsKey(alycId), { score, member: review.id })
      .incrby(alycRatingSumKey(alycId), rating)
      .incr(alycRatingCountKey(alycId))
      .exec();
  } catch (error) {
    await redis.del(userKey);
    throw error;
  }

  return review;
}

export async function updateReview(
  reviewId: string,
  userId: string,
  rating: number,
  body: string,
): Promise<Review> {
  const redis = getRedis();
  const existing = await getReviewById(reviewId);

  if (!existing) {
    throw new Error("Reseña no encontrada.");
  }

  if (existing.userId !== userId) {
    throw new Error("No podés editar esta reseña.");
  }

  const updated: Review = {
    ...existing,
    rating,
    body: body.trim(),
    updatedAt: new Date().toISOString(),
  };

  await redis
    .pipeline()
    .set(reviewKey(reviewId), updated)
    .incrby(alycRatingSumKey(existing.alycId), rating - existing.rating)
    .exec();
  return updated;
}

export async function deleteReview(reviewId: string, userId: string): Promise<void> {
  const redis = getRedis();
  const existing = await getReviewById(reviewId);

  if (!existing) {
    throw new Error("Reseña no encontrada.");
  }

  if (existing.userId !== userId) {
    throw new Error("No podés eliminar esta reseña.");
  }

  await redis
    .pipeline()
    .del(reviewKey(reviewId))
    .zrem(alycReviewsKey(existing.alycId), reviewId)
    .del(userAlycReviewKey(userId, existing.alycId))
    .incrby(alycRatingSumKey(existing.alycId), -existing.rating)
    .decr(alycRatingCountKey(existing.alycId))
    .exec();
}
