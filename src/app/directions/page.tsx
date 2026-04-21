import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/metadata";
import { siteContent } from "@/lib/site-content";

export const metadata = createMetadata(
  "Направления",
  "Основные направления деятельности Союза: промышленность, торговля, инициативы бизнеса, институты поддержки, общественные программы и межрегиональные связи.",
);

export default function DirectionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Направления"
        title={siteContent.directionsIntro.title}
        description={siteContent.directionsIntro.lead}
      />

      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container space-y-6">
          {siteContent.directions.map((item, index) => (
            <article
              key={item.title}
              className="grid gap-6 rounded-[32px] border border-[var(--color-line)] bg-white p-8 lg:grid-cols-[96px_minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start"
            >
              <div className="text-[var(--color-accent)]">
                <span className="text-xs font-semibold uppercase tracking-[0.28em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                  {item.title}
                </h2>
                <p className="text-base leading-8 text-[var(--color-muted)]">
                  {item.paragraphs[0]}
                </p>
              </div>

              <p className="text-sm leading-7 text-[var(--color-soft)]">
                {item.paragraphs[1]}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
