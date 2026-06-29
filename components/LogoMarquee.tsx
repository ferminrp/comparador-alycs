import { alycs, getFaviconUrl } from "@/lib/alycs";

const MARQUEE_LOGOS = [...alycs, ...alycs];

export function LogoMarquee() {
  return (
    <div
      className="relative mt-12 w-full overflow-hidden sm:mt-16"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />

      <div className="flex w-max animate-marquee items-center gap-12 sm:gap-16">
        {MARQUEE_LOGOS.map((alyc, index) => (
          <img
            key={`${alyc.id}-${index}`}
            src={getFaviconUrl(alyc.domain, 128)}
            alt=""
            width={40}
            height={40}
            className="h-8 w-8 shrink-0 object-contain opacity-35 grayscale sm:h-10 sm:w-10"
            loading="eager"
          />
        ))}
      </div>
    </div>
  );
}
