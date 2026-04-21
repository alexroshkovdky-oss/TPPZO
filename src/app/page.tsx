import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { HeroLinksStrip } from "@/components/hero-links-strip";
import { HeroMediaCarousel } from "@/components/hero-media-carousel";
import { SectionHeading } from "@/components/section-heading";
import { getEconomicNewsFeed } from "@/lib/interfax-news";
import { createMetadata } from "@/lib/metadata";
import { contactMailto, siteContent } from "@/lib/site-content";

export const metadata = createMetadata(
  "Главная",
  "Официальный сайт-визитка Союза содействия развитию промышленности и торговли Запорожской и Херсонской областей.",
);

export default async function Home() {
  const liveNews = await getEconomicNewsFeed(3);
  const newsItems = liveNews.length > 0 ? liveNews : siteContent.news.items;

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-deep)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,180,219,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(241,200,141,0.16),transparent_24%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        <div className="site-container relative py-20 sm:py-24 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(500px,0.82fr)] lg:items-center lg:gap-14 xl:gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="site-display max-w-[38rem] text-4xl leading-[1.04] sm:text-5xl lg:text-[4.2rem]">
                  {siteContent.name}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
                  {siteContent.heroSubtitle}
                </p>
              </div>

              <HeroLinksStrip items={siteContent.heroLinks} />

              <div className="grid gap-5 border-t border-white/12 pt-7 sm:grid-cols-3">
                {siteContent.keyPoints.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/46">
                      {item.label}
                    </p>
                    <p className="text-base font-semibold">{item.value}</p>
                    <p className="text-sm leading-6 text-white/62">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="w-full lg:justify-self-end lg:self-center xl:translate-x-14 2xl:translate-x-18">
              <HeroMediaCarousel items={siteContent.heroMedia} />
            </aside>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <SectionHeading
            eyebrow={siteContent.aboutHome.title}
            title={siteContent.aboutHome.lead}
            description="Союз объединяет деловую, общественную и партнёрскую повестку вокруг тем, значимых для экономики и устойчивого развития региона."
          />

          <div className="space-y-6 text-lg leading-8 text-[var(--color-muted)]">
            {siteContent.aboutHome.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing border-y border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="site-container space-y-12">
          <SectionHeading
            eyebrow="Направления деятельности"
            title={siteContent.directionsIntro.title}
            description={siteContent.directionsIntro.lead}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {siteContent.directions.map((item) => (
              <article
                key={item.title}
                className="rounded-[28px] border border-[var(--color-line)] bg-white p-7 shadow-[0_18px_60px_rgba(14,28,45,0.06)]"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  {item.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-7 text-[var(--color-muted)]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <SectionHeading
            eyebrow="Приоритетные темы"
            title={siteContent.priorities.title}
            description={siteContent.priorities.lead}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {siteContent.priorities.items.map((item) => (
              <div
                key={item}
                className="flex min-h-[9rem] items-center justify-center rounded-[24px] border border-[var(--color-line)] bg-white px-6 py-5 text-center text-sm leading-7 text-[var(--color-muted)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-[var(--color-deep)] text-white">
        <div className="site-container grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="max-w-3xl space-y-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Форматы взаимодействия
            </p>
            <h2 className="max-w-2xl text-2xl font-semibold tracking-[-0.05em] text-white sm:text-3xl lg:text-4xl">
              {siteContent.formats.title}
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              {siteContent.formats.lead}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {siteContent.formats.items.map((item) => (
              <article
                key={item.title}
                className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing border-y border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="site-container space-y-12">
          <SectionHeading
            eyebrow="Актуальное"
            title={siteContent.news.title}
            description={siteContent.news.lead}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {newsItems.map((item) => (
              <article
                key={item.title}
                className="flex h-full flex-col justify-between rounded-[28px] border border-[var(--color-line)] bg-white p-7"
              >
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                    {item.period}
                  </p>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-[var(--color-muted)]">
                    {item.description}
                  </p>
                </div>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 text-sm font-semibold text-[var(--color-deep)] transition hover:text-[var(--color-accent)]"
                >
                  {item.sourceLabel}
                </a>
              </article>
            ))}
          </div>

          <div>
            <Link href="/news" className="button-secondary-dark">
              Смотреть раздел новостей
            </Link>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Контакт"
              title={siteContent.contactBlock.title}
              description={siteContent.contactBlock.lead}
            />

            <div className="space-y-3 rounded-[28px] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-sm leading-7 text-[var(--color-muted)]">
              <p>
                Email для обращений:{" "}
                <a
                  href={contactMailto}
                  className="font-semibold text-[var(--color-deep)] transition hover:text-[var(--color-accent)]"
                >
                  {siteContent.contacts.email}
                </a>
              </p>
              <p>{siteContent.legal.address}</p>
              <p>{siteContent.contacts.phoneLabel}</p>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
