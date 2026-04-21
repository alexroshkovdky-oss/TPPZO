import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/metadata";
import { partnersCatalog, siteContent } from "@/lib/site-content";

export const metadata = createMetadata(
  "Партнёры",
  "Партнёрские организации и площадки, связанные с деловой и общественной повесткой Союза.",
);

export default function MembersPage() {
  return (
    <>
      <PageHero
        eyebrow="Партнёры"
        title="Партнёрские организации Союза"
        description={siteContent.partnersPage.intro}
      />

      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Партнёрская лента
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[var(--color-ink)]">
              Перечень партнёров и информация о них
            </h2>
          </div>

          <div className="max-h-[40rem] overflow-y-auto pr-2">
            <div className="space-y-5">
              {partnersCatalog.map((partner) => (
                <Link
                  key={partner.id}
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block cursor-pointer overflow-hidden rounded-[32px] border border-[#d6dfeb] bg-white p-7 transition duration-300 hover:border-[#2a5d8f] hover:bg-[#fbfdff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a5d8f]/20"
                >
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                        {partner.type}
                      </p>
                      <h3 className="text-3xl font-semibold tracking-[-0.05em] text-[var(--color-ink)] transition-colors duration-300 group-hover:text-[#153d67]">
                        {partner.name}
                      </h3>
                    </div>

                    <p className="max-w-4xl text-base leading-8 text-[var(--color-muted)]">
                      {partner.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
