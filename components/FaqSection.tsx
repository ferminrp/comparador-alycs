import type { FaqItem } from "@/lib/seo";

type FaqSectionProps = {
  faqs: FaqItem[];
  title?: string;
};

export function FaqSection({
  faqs,
  title = "Preguntas frecuentes",
}: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-zinc-900">{title}</h2>
      <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
        {faqs.map((faq) => (
          <details key={faq.question} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-900 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-zinc-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
