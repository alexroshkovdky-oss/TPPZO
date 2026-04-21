"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type FormState = {
  name: string;
  organization: string;
  contact: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  organization: "",
  contact: "",
  subject: "",
  message: "",
};

type ContactFormProps = {
  selectedSubject?: string;
  submitOffset?: "default" | "lower" | "lowest";
};

type ContactApiResponse = {
  ok?: boolean;
  message?: string;
  redirectUrl?: string;
};

export function ContactForm({
  selectedSubject = "",
  submitOffset = "default",
}: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subjectInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedSubject) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setFormState((current) => ({
        ...current,
        subject: selectedSubject,
      }));
      subjectInputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [selectedSubject]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name || !formState.contact || !formState.subject) {
      setFeedback("Заполните имя, контакт и тему обращения.");
      return;
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const result = (await response.json()) as ContactApiResponse;

      if (!response.ok || !result.ok) {
        setFeedback(
          result.message || "Не удалось отправить обращение. Попробуйте ещё раз.",
        );
        return;
      }

      setFeedback(result.message || "Обращение отправлено.");

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }

      setFormState({
        ...initialState,
        subject: selectedSubject || "",
      });
    } catch {
      setFeedback("Не удалось отправить обращение. Проверьте соединение и попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        handleSubmit(event);

        if (!formState.name || !formState.contact || !formState.subject) {
          return;
        }

        void submitForm();
      }}
      className="space-y-5 rounded-[28px] border border-[var(--color-line)] bg-white p-6 shadow-[0_24px_80px_rgba(14,28,45,0.08)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-[var(--color-muted)]">
          <span>Имя</span>
          <input
            type="text"
            value={formState.name}
            onChange={(event) =>
              setFormState((current) => ({ ...current, name: event.target.value }))
            }
            className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
            placeholder="Как к вам обращаться"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--color-muted)]">
          <span>Организация</span>
          <input
            type="text"
            value={formState.organization}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                organization: event.target.value,
              }))
            }
            className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
            placeholder="Компания, объединение или проект"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--color-muted)]">
          <span>Телефон или email</span>
          <input
            type="text"
            value={formState.contact}
            onChange={(event) =>
              setFormState((current) => ({ ...current, contact: event.target.value }))
            }
            className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
            placeholder="Чтобы можно было ответить"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--color-muted)]">
          <span>Тема обращения</span>
          <input
            ref={subjectInputRef}
            type="text"
            value={formState.subject}
            onChange={(event) =>
              setFormState((current) => ({ ...current, subject: event.target.value }))
            }
            className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
            placeholder="Кратко обозначьте тему"
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm text-[var(--color-muted)]">
        <span>Комментарий (необязательно)</span>
        <textarea
          value={formState.message}
          onChange={(event) =>
            setFormState((current) => ({ ...current, message: event.target.value }))
          }
          rows={6}
          className="w-full rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]"
          placeholder="Можно указать детали запроса, сроки или дополнительные пожелания"
        />
      </label>

      <div className="flex flex-col gap-3 border-t border-[var(--color-line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-sm text-[var(--color-muted)]">{feedback ? <p>{feedback}</p> : null}</div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`button-primary ${
            submitOffset === "lowest"
              ? "sm:translate-y-7"
              : submitOffset === "lower"
                ? "sm:translate-y-2"
                : ""
          }`}
        >
          {isSubmitting ? "Отправка..." : "Отправить обращение"}
        </button>
      </div>
    </form>
  );
}
