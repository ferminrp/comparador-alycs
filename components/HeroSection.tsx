import { LogoMarquee } from "@/components/LogoMarquee";

export function HeroSection() {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20 md:py-24">
        <h1 className="font-serif text-[2rem] leading-[1.15] tracking-tight text-zinc-900 sm:text-5xl sm:leading-[1.12] md:text-[3.25rem]">
          No todas las Alycs cobran lo mismo.{" "}
          <span className="text-zinc-600">
            Cuida tu plata, no la pierdas en comisiones.
          </span>
        </h1>

        <LogoMarquee />
      </div>
    </section>
  );
}
