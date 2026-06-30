import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAlycById } from "@/lib/alycs";
import { isRedisConfigured } from "@/lib/redis";
import {
  createReview,
  listReviewsByAlyc,
  validateReviewInput,
} from "@/lib/reviews";

type RouteContext = {
  params: Promise<{ alycId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { alycId } = await context.params;

  if (!getAlycById(alycId)) {
    return NextResponse.json({ error: "ALYC no encontrada." }, { status: 404 });
  }

  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: "El servicio de reseñas no está configurado." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

  try {
    const data = await listReviewsByAlyc(alycId, limit, offset);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "No se pudieron cargar las reseñas." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Tenés que iniciar sesión con X para publicar una reseña." },
      { status: 401 },
    );
  }

  const { alycId } = await context.params;

  if (!getAlycById(alycId)) {
    return NextResponse.json({ error: "ALYC no encontrada." }, { status: 404 });
  }

  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: "El servicio de reseñas no está configurado." },
      { status: 503 },
    );
  }

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
    const review = await createReview(
      alycId,
      {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
      },
      rating as number,
      reviewBody as string,
    );

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo publicar la reseña.";

    const status = message.includes("Ya publicaste") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
