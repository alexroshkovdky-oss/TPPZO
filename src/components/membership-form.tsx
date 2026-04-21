"use client";

import { FormEvent, useState } from "react";

import { siteContent } from "@/lib/site-content";

type MembershipFormState = {
  fullName: string;
  inn: string;
  phone: string;
  email: string;
};

const initialState: MembershipFormState = {
  fullName: "",
  inn: "",
  phone: "",
  email: "",
};

export function MembershipForm() {
  const [formState, setFormState] = useState<MembershipFormState>(initialState);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.fullName || !formState.inn || !formState.phone || !formState.email) {
      setFeedback("Заполните Ф.И.О. директора, ИНН организации, телефон и электронную почту.");
      return;
    }

    const body = [
      "Заявление о вступлении в члены Союза",
      "",
      `Ф.И.О. директора: ${formState.fullName}`,
      `ИНН организации: ${formState.inn}`,
      `Телефон: ${formState.phone}`,
      `Электронная почта: ${formState.email}`,
    ].join("\n");

    window.location.href = `mailto:${siteContent.contacts.email}?subject=${encodeURIComponent(
      "Заявление о вступлении в члены Союза",
    )}&body=${encodeURIComponent(body)}`;

    setFeedback(
      "Открылось письмо на официальный адрес Союза. Проверьте данные и отправьте заявление.",
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[28px] border border-[var(--color-line)] bg-white p-6 shadow-[0_24px_80px_rgba(14,28,45,0.08)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-[var(--color-muted)] sm:col-span-2">
          <span>Ф.И.О. директора</span>
          <input
            type="text"
            value={formState.fullName}
            onChange={(event) =>
              setFormState((current) => ({ ...current, fullName: event.target.value }))
            }
            className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
            placeholder="Полностью"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--color-muted)]">
          <span>ИНН организации</span>
          <input
            type="text"
            value={formState.inn}
            onChange={(event) =>
              setFormState((current) => ({ ...current, inn: event.target.value }))
            }
            className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
            placeholder="ИНН организации"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--color-muted)]">
          <span>Телефон</span>
          <input
            type="text"
            value={formState.phone}
            onChange={(event) =>
              setFormState((current) => ({ ...current, phone: event.target.value }))
            }
            className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
            placeholder="Контактный телефон"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--color-muted)] sm:col-span-2">
          <span>Электронная почта</span>
          <input
            type="email"
            value={formState.email}
            onChange={(event) =>
              setFormState((current) => ({ ...current, email: event.target.value }))
            }
            className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
            placeholder="Email для обратной связи"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-sm text-[var(--color-muted)]">
          <p>{feedback}</p>
        </div>

        <button type="submit" className="button-primary">
          Подать заявление
        </button>
      </div>
    </form>
  );
}
