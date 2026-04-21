import { MembershipForm } from "@/components/membership-form";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata(
  "Вступить в члены Союза",
  "Упрощённая подача заявления на вступление в члены Союза.",
);

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Вступить в члены Союза"
        title="Упрощённая подача заявления на вступление."
        description="Если вы хотите рассмотреть вопрос о вступлении в Союз, заполните основные данные. Заявление будет направлено на официальный адрес."
      />

      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
              Что понадобится для подачи заявления
            </h2>
            <div className="space-y-4 text-base leading-8 text-[var(--color-muted)]">
              <p>Для первичного обращения достаточно указать Ф.И.О. директора, ИНН организации, телефон и адрес электронной почты.</p>
              <p>После получения обращения Союз сможет связаться с вами для уточнения дальнейшего порядка взаимодействия.</p>
            </div>
          </div>

          <MembershipForm />
        </div>
      </section>
    </>
  );
}
