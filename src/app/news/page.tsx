import { PageHero } from "@/components/page-hero";
import { getEconomicNewsFeed } from "@/lib/interfax-news";
import { createMetadata } from "@/lib/metadata";
import { siteContent } from "@/lib/site-content";

export const metadata = createMetadata(
  "Экономические новости России",
  "Открытая лента экономических новостей России: промышленность, бизнес, инвестиции, торговля и деловая повестка из федеральных и отраслевых источников.",
);

export default async function NewsPage() {
  const liveNews = await getEconomicNewsFeed(8);
  const newsItems = liveNews.length > 0 ? liveNews : siteContent.news.items;

  return (
    <>
      <PageHero
        eyebrow="Экономическая повестка"
        title={siteContent.news.title}
        description={siteContent.news.lead}
      />

      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container space-y-6">
          {newsItems.map((item) => (
            <article
              key={item.title}
              className="grid gap-6 rounded-[32px] border border-[var(--color-line)] bg-white p-8 lg:grid-cols-[180px_minmax(0,1fr)]"
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                  {item.period}
                </p>
                <p className="text-sm leading-7 text-[var(--color-soft)]">
                  Открытая информация и публичная повестка
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                  {item.title}
                </h2>
                <p className="max-w-4xl text-base leading-8 text-[var(--color-muted)]">
                  {item.description}
                </p>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-deep)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {item.sourceLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
