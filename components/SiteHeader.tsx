import Link from "next/link";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/#brokers", label: "Brokers" },
  { href: "/#comparar", label: "Comparar" },
  { href: "/#calculadora", label: "Calculadora" },
  { href: "/contacto", label: "Contacto" },
];

const linkClassName =
  "text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-700";

export function SiteHeader() {
  return (
    <header className="relative border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900"
        >
          Comparador ALYC
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClassName}>
              {link.label}
            </Link>
          ))}
        </nav>
        <MobileNav links={navLinks} />
      </div>
    </header>
  );
}
