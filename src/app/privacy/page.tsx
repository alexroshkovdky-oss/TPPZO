import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/metadata";
import { siteContent } from "@/lib/site-content";

export const metadata = createMetadata(
  "Политика конфиденциальности",
  "Политика конфиденциальности и обработки персональных данных для сайта Союза.",
);

const privacySections = [
  {
    title: "1. Общие положения",
    text: "Настоящая политика описывает подход к обработке персональных данных пользователей сайта Союза содействия развитию промышленности и торговли Запорожской и Херсонской областей.",
  },
  {
    title: "2. Какие данные могут обрабатываться",
    text: "Через форму обратной связи пользователь может добровольно передать имя, сведения об организации, контактные данные, тему обращения и текст сообщения. Эти сведения используются для рассмотрения обращения и обратной связи по нему.",
  },
  {
    title: "3. Цели обработки",
    text: "Персональные данные могут использоваться для приёма и анализа обращений, организации обратной связи, рассмотрения предложений о сотрудничестве и ведения деловой переписки в рамках деятельности Союза.",
  },
  {
    title: "4. Передача и хранение данных",
    text: "Союз не публикует персональные данные пользователей и не использует их в целях, не связанных с обработкой обращения. Сведения обрабатываются только в объёме, необходимом для делового ответа.",
  },
  {
    title: "5. Контакты по вопросам обработки данных",
    text: `По вопросам, связанным с обработкой персональных данных и использованием сайта, можно обратиться по адресу ${siteContent.contacts.email}.`,
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Политика конфиденциальности"
        title="Политика конфиденциальности"
        description={siteContent.privacyPage.intro}
      />

      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container space-y-6">
          {privacySections.map((section) => (
            <article
              key={section.title}
              className="rounded-[32px] border border-[var(--color-line)] bg-white p-8"
            >
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                {section.title}
              </h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
                {section.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
