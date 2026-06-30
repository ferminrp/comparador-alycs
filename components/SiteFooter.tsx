import { FooterBrokerLinks } from "@/components/RelatedLinks";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <FooterBrokerLinks />
        <p className="text-sm text-zinc-500">
          Los tarifarios son publicados por cada ALYC y pueden cambiar sin
          previo aviso. Verificá siempre la fuente oficial antes de operar.
        </p>
      </div>
    </footer>
  );
}
