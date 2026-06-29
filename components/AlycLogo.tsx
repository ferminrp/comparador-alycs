import { getFaviconUrl } from "@/lib/alycs";

type AlycLogoProps = {
  domain: string;
  name: string;
  size?: number;
  className?: string;
};

export function AlycLogo({
  domain,
  name,
  size = 32,
  className = "",
}: AlycLogoProps) {
  return (
    <img
      src={getFaviconUrl(domain, 128)}
      alt={`Logo de ${name}`}
      width={size}
      height={size}
      className={`rounded-lg bg-zinc-100 object-contain ${className}`}
      loading="lazy"
    />
  );
}
