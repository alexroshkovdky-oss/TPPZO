"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type AssistantApiResponse = {
  ok?: boolean;
  answer?: string;
  message?: string;
};

const greeting: ChatMessage = {
  role: "assistant",
  content: "Здравствуйте, чем я могу вам помочь?",
};

const suggestions = [
  "Какие услуги оказывает Союз?",
  "Как вступить в члены Союза?",
  "Как направить обращение по услуге?",
];

const resetDelayMs = 300_000;

export function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [lastActivity, setLastActivity] = useState(() => Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMessages([greeting]);
      setInput("");
      setFeedback("");
      setIsLoading(false);
    }, resetDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [lastActivity]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isOpen, messages]);

  const touchActivity = () => setLastActivity(Date.now());

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText || isLoading) {
      return;
    }

    touchActivity();
    setFeedback("");
    setInput("");

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmedText },
    ];

    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.filter((message) => message !== greeting),
        }),
      });

      const result = (await response.json()) as AssistantApiResponse;

      if (!response.ok || !result.ok || !result.answer) {
        setFeedback(result.message || "Ассистент временно недоступен.");
        return;
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.answer ?? "" },
      ]);
    } catch {
      setFeedback("Не удалось получить ответ. Проверьте соединение и попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
      touchActivity();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed right-4 bottom-4 z-[80] sm:right-6 sm:bottom-6">
      {isOpen ? (
        <section
          aria-label="ИИ-ассистент Союза"
          className="mb-4 flex h-[min(36rem,calc(100vh-7rem))] w-[min(calc(100vw-2rem),24rem)] flex-col overflow-hidden rounded-[28px] border border-white/55 bg-white shadow-[0_24px_80px_rgba(8,24,40,0.24)]"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-line)] bg-[linear-gradient(135deg,#102b46,#143f66)] px-5 py-4 text-white">
            <div>
              <p className="text-sm font-semibold">ИИ-ассистент</p>
              <p className="mt-1 text-xs text-white/70">Вопросы о Союзе и услугах</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                touchActivity();
              }}
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-white/15 text-lg leading-none text-white/75 transition hover:bg-white/10 hover:text-white"
              aria-label="Закрыть чат"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f4f7fa] px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-[#143f66] text-white"
                      : "border border-[var(--color-line)] bg-white text-[var(--color-ink)]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-muted)]">
                  Ассистент готовит ответ...
                </div>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[var(--color-line)] bg-white p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendMessage(suggestion)}
                  className="cursor-pointer rounded-full border border-[#c9d5df] bg-[#eef4f9] px-3 py-2 text-left text-xs font-semibold text-[var(--color-ink)] transition hover:border-[#6f94b6] hover:bg-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {feedback ? (
              <p className="mb-3 text-sm leading-5 text-[var(--color-muted)]">{feedback}</p>
            ) : null}

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  touchActivity();
                }}
                className="min-w-0 flex-1 rounded-full border border-[#c9d5df] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[#1b5f97]"
                placeholder="Введите вопрос"
                aria-label="Вопрос ассистенту"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-[#143f66] text-white transition hover:bg-[#1b5f97] disabled:cursor-not-allowed disabled:opacity-55"
                aria-label="Отправить вопрос"
              >
                <SendIcon />
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
          touchActivity();
        }}
        className="ml-auto grid size-14 cursor-pointer place-items-center rounded-full border border-white/45 bg-[linear-gradient(135deg,#1b5f97,#123a5f)] text-white shadow-[0_18px_44px_rgba(8,24,40,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(8,24,40,0.32)]"
        aria-label={isOpen ? "Закрыть ИИ-ассистента" : "Открыть ИИ-ассистента"}
      >
        <MessageIcon />
      </button>
    </div>
  );
}

function MessageIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.5 17.5H6a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-5.2L8 20.5v-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10h9M7.5 13h5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 12 20 4l-5.4 16-3.1-6.9L4 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
