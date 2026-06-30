import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function SlugNotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Página no encontrada
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          No encontramos la página que buscás.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
        >
          Volver al inicio
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
