import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Contacto | Comparador de comisiones ALYC",
  description:
    "Agregá una ALYC al comparador o reportá un error en los datos de comisiones.",
};

export default function ContactoPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Contacto
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          ¿Falta algún broker o hay un dato incorrecto? Contanos y lo
          actualizamos.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
