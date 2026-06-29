import { alycs, getFaviconUrl } from "@/lib/alycs";

export function LogoMarquee() {
  return (
    <div
      className="relative mt-12 w-full overflow-hidden sm:mt-16"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />

      <div className="flex w-max animate-marquee">
        {[0, 1].map((set) => (
          <div
            key={set}
            className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
          >
            {alycs.map((alyc) => (
              <img
                key={`${set}-${alyc.id}`}
                src={getFaviconUrl(alyc.domain, 128)}
                alt=""
                width={40}
                height={40}
                className="h-8 w-8 shrink-0 object-contain opacity-35 grayscale sm:h-10 sm:w-10"
                loading="eager"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
