"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { ServiceIcon } from "@/components/service-icon";

type ServiceItem = {
  id: string;
  title: string;
  summary: string;
  details: readonly string[];
  icon:
    | "document"
    | "certificate"
    | "graph"
    | "consulting"
    | "shield"
    | "coins"
    | "globe"
    | "briefcase";
  subject: string;
  featured?: boolean;
};

type ServicesShowcaseProps = {
  services: readonly ServiceItem[];
  selectedSubject?: string;
};

export function ServicesShowcase({
  services,
  selectedSubject = "",
}: ServicesShowcaseProps) {
  const router = useRouter();
  const [activeServiceId, setActiveServiceId] = useState("");
  const formSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedSubject) {
      return;
    }

    const target = formSectionRef.current;

    if (!target) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const yOffset = 136;
      const y = target.getBoundingClientRect().top + window.scrollY - yOffset;

      window.scrollTo({
        top: Math.max(0, y),
        behavior: "smooth",
      });
    }, 420);

    return () => window.clearTimeout(timeoutId);
  }, [selectedSubject]);

  const handleOrderClick = (service: ServiceItem) => {
    setActiveServiceId("");
    router.push(`/partnership?service=${encodeURIComponent(service.subject)}`, {
      scroll: false,
    });
  };

  return (
    <>
      <section className="section-spacing bg-[var(--color-background)]">
        <div className="site-container space-y-12">
          <SectionHeading
            eyebrow="Каталог услуг"
            title="Форматы сопровождения, консультационной и рабочей поддержки."
            description="Выберите подходящее направление, чтобы посмотреть детали услуги и сразу перейти к обращению по нужному вопросу."
          />

          <div className="grid items-start gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const isActive = activeServiceId === service.id;

              return (
                <article
                  key={service.id}
                  tabIndex={0}
                  onMouseEnter={() => setActiveServiceId(service.id)}
                  onFocus={() => setActiveServiceId(service.id)}
                  onMouseLeave={() => setActiveServiceId("")}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setActiveServiceId("");
                    }
                  }}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`group relative self-start overflow-hidden rounded-[30px] border p-6 transition-[background,border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    service.featured ? "xl:col-span-3" : ""
                  } ${
                    isActive
                      ? "border-[#1d5e95] bg-[linear-gradient(180deg,#143150_0%,#10243a_100%)] text-white shadow-[0_24px_80px_rgba(17,43,70,0.22)]"
                      : "border-[var(--color-line)] bg-white text-[var(--color-ink)] shadow-[0_18px_60px_rgba(14,28,45,0.06)]"
                  }`}
                >
                  <div
                    className={`flex gap-6 ${
                      service.featured ? "flex-col lg:flex-row lg:items-start" : "flex-col"
                    }`}
                  >
                    <div
                      className={`flex items-start justify-between gap-4 ${
                        service.featured ? "lg:w-[26rem] lg:flex-none" : ""
                      }`}
                    >
                      <div className="space-y-4">
                        {service.featured ? (
                          <p
                            className={`text-xs font-semibold uppercase tracking-[0.28em] ${
                              isActive ? "text-[#f0c57a]" : "text-[var(--color-accent)]"
                            }`}
                          >
                            Приоритетная услуга
                          </p>
                        ) : null}
                        <h3
                          className={`text-2xl font-semibold tracking-[-0.04em] ${
                            isActive ? "text-white" : "text-[var(--color-ink)]"
                          }`}
                        >
                          {service.title}
                        </h3>
                        <p
                          className={`text-sm leading-7 ${
                            isActive ? "text-white/78" : "text-[var(--color-muted)]"
                          }`}
                        >
                          {service.summary}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <ServiceIcon kind={service.icon} />
                      </div>
                    </div>

                    <div
                      className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      } ${
                        service.featured ? "lg:flex-1" : ""
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div
                          className={`space-y-4 border-t pt-5 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isActive ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                          } ${
                            isActive
                              ? "border-white/12"
                              : "border-[var(--color-line)]"
                          }`}
                        >
                          {service.details.map((detail) => (
                            <p
                              key={detail}
                              className={`text-sm leading-7 ${
                                isActive ? "text-white/82" : "text-[var(--color-muted)]"
                              }`}
                            >
                              {detail}
                            </p>
                          ))}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOrderClick(service);
                            }}
                            className={`mt-2 inline-flex cursor-pointer items-center border-b pb-0.5 text-sm font-semibold tracking-[-0.01em] transition ${
                              isActive
                                ? "border-white/55 text-white hover:border-white hover:text-white"
                                : "border-[var(--color-deep)]/35 text-[var(--color-deep)] hover:border-[var(--color-deep)] hover:text-[var(--color-ink)]"
                            }`}
                          >
                            Заказать услугу
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={formSectionRef}
        id="service-request"
        className="section-spacing scroll-mt-36 border-y border-[var(--color-line)] bg-[var(--color-surface)]"
      >
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <SectionHeading
            eyebrow="Обращение по услугам"
            title="Если вам требуется дополнительная поддержка или вы хотите обсудить формат взаимодействия, направьте обращение через форму связи."
            description="Тема обращения подставляется автоматически после выбора услуги. При необходимости можно дополнить запрос деталями в комментарии."
          />

          <ContactForm selectedSubject={selectedSubject} />
        </div>
      </section>
    </>
  );
}
