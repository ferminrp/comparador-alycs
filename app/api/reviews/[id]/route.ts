import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isRedisConfigured } from "@/lib/redis";
import { deleteReview, updateReview, validateReviewInput } from "@/lib/reviews";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: "El servicio de reseñas no está configurado." },
      { status: 503 },
    );
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { rating, body: reviewBody } = body as {
    rating?: unknown;
    body?: unknown;
  };

  const validationError = validateReviewInput(rating, reviewBody);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const review = await updateReview(
      id,
      session.user.id,
      rating as number,
      reviewBody as string,
      {
        xUsername: session.user.username,
        followersCount: session.user.followersCount,
      },
    );
    return NextResponse.json({ review });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo actualizar la reseña.";
    const status = message.includes("no encontrada")
      ? 404
      : message.includes("No podés")
        ? 403
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: "El servicio de reseñas no está configurado." },
      { status: 503 },
    );
  }

  const { id } = await context.params;

  try {
    await deleteReview(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo eliminar la reseña.";
    const status = message.includes("no encontrada")
      ? 404
      : message.includes("No podés")
        ? 403
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
