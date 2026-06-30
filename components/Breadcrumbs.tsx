import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true" className="text-zinc-300">
                  /
                </span>
              )}
              {isLast ? (
                <span className="font-medium text-zinc-700">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-emerald-700"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
