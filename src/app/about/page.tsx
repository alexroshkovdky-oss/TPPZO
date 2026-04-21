import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { createMetadata } from "@/lib/metadata";
import { siteContent } from "@/lib/site-content";

export const metadata = createMetadata(
  "О Союзе",
  "Миссия, цели, ценности и юридическая информация Союза содействия развитию промышленности и торговли Запорожской и Херсонской областей.",
);

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="О Союзе"
        title={siteContent.aboutPage.mission}
        description={siteContent.aboutPage.intro}
      />

      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container grid gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <SectionHeading
            eyebrow="Миссия"
            title={siteContent.aboutPage.mission}
            description="Союз рассматривает взаимодействие как основу для выстраивания устойчивых деловых и общественных связей."
          />

          <div className="space-y-6 text-lg leading-8 text-[var(--color-muted)]">
            <p>{siteContent.aboutPage.intro}</p>
            {siteContent.aboutHome.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing border-y border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="site-container grid gap-8 lg:grid-cols-2">
          <article className="rounded-[32px] border border-[var(--color-line)] bg-white p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
              Цели работы
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
              {siteContent.aboutPage.goals.map((item) => (
                <p
                  key={item}
                  className="border-b border-[var(--color-line)] pb-4 last:border-0 last:pb-0"
                >
                  {item}
                </p>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-[var(--color-line)] bg-white p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
              Ценности
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
              {siteContent.aboutPage.values.map((item) => (
                <p
                  key={item}
                  className="border-b border-[var(--color-line)] pb-4 last:border-0 last:pb-0"
                >
                  {item}
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container space-y-12">
          <SectionHeading
            eyebrow="Практические форматы работы"
            title="Союз участвует не только в общественной и деловой повестке, но и в практической поддержке профильных обращений."
            description={siteContent.aboutPage.serviceFormatsIntro}
          />

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {siteContent.aboutPage.serviceFormats.map((item) => (
              <article
                key={item.title}
                className="rounded-[28px] border border-[var(--color-line)] bg-white p-6 shadow-[0_18px_60px_rgba(14,28,45,0.06)]"
              >
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div className="rounded-[32px] border border-[var(--color-line)] bg-[var(--color-surface)] p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
              Для членов Союза
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {siteContent.aboutPage.memberFormats.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-[var(--color-line)] bg-white p-5"
                >
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-[var(--color-line)] bg-[var(--color-background)]">
        <div className="site-container grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <SectionHeading
            eyebrow="Юридическая информация"
            title="Основные сведения об организации размещены в открытом доступе для удобства партнёров и посетителей сайта."
            description={siteContent.aboutPage.legalInfo}
          />

          <div className="rounded-[32px] border border-[var(--color-line)] bg-white p-8">
            <div className="grid gap-5 text-sm leading-7 text-[var(--color-muted)] sm:grid-cols-2">
              <p>Полное наименование: {siteContent.name}</p>
              <p>Организационно-правовая форма: {siteContent.legal.legalForm}</p>
              <p>ИНН: {siteContent.legal.inn}</p>
              <p>КПП: {siteContent.legal.kpp}</p>
              <p>ОГРН: {siteContent.legal.ogrn}</p>
              <p>ОКПО: {siteContent.legal.okpo}</p>
              <p>Дата регистрации: {siteContent.legal.registrationDate}</p>
              <p>Основной ОКВЭД: {siteContent.legal.okved}</p>
              <p className="sm:col-span-2">Юридический адрес: {siteContent.legal.address}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
