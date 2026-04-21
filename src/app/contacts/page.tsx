import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/metadata";
import { contactMailto, siteContent } from "@/lib/site-content";

export const metadata = createMetadata(
  "Контакты",
  "Контактная информация Союза: адрес, email, юридические реквизиты и форма обратной связи.",
);

export default function ContactsPage() {
  return (
    <>
      <PageHero
        eyebrow="Контакты"
        title="Контактная информация Союза"
        description={siteContent.contactsPage.intro}
      />

      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div className="space-y-6">
            <article className="rounded-[32px] border border-[var(--color-line)] bg-white p-8">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                Контактные каналы
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
                <p>
                  Email:{" "}
                  <a
                    href={contactMailto}
                    className="font-semibold text-[var(--color-deep)] transition hover:text-[var(--color-accent)]"
                  >
                    {siteContent.contacts.email}
                  </a>
                </p>
                <p>{siteContent.contacts.phoneLabel}</p>
                <p>{siteContent.legal.address}</p>
              </div>
            </article>

            <article className="rounded-[32px] border border-[var(--color-line)] bg-white p-8">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                Реквизиты
              </h2>
              <div className="mt-6 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
                <p>ИНН {siteContent.legal.inn}</p>
                <p>КПП {siteContent.legal.kpp}</p>
                <p>ОГРН {siteContent.legal.ogrn}</p>
                <p>Дата регистрации {siteContent.legal.registrationDate}</p>
              </div>
            </article>
          </div>

          <ContactForm submitOffset="lowest" />
        </div>
      </section>
    </>
  );
}
