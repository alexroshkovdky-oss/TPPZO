"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  businessNavigatorSuggestions,
  type BusinessNavigatorMessage,
  type BusinessNavigatorProfile,
} from "@/lib/business-navigator";

type NavigatorApiResponse = {
  ok?: boolean;
  answer?: string;
  message?: string;
};

type ContactApiResponse = {
  ok?: boolean;
  message?: string;
  redirectUrl?: string;
};

type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  MainButton?: {
    hide?: () => void;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

const greeting: BusinessNavigatorMessage = {
  role: "assistant",
  content:
    "Здравствуйте, чем я могу вам помочь? Я могу подсказать маршрут по мерам поддержки, СЭЗ, услугам Союза, документам и обращению.",
};

const resetDelayMs = 300_000;
const profileStorageKey = "tppzo-business-navigator-profile";

const regions = ["Запорожская область", "Херсонская область", "Другой регион РФ"];
const forms = ["ООО", "ИП", "Самозанятый", "НКО", "Фермерское хозяйство"];
const employees = ["до 5", "6-15", "16-50", "51-100", "100+"];
const projectStages = [
  "Идея",
  "Действующий бизнес",
  "Расширение",
  "Инвестпроект",
  "Документы к подаче",
];
const spheres = [
  "Промышленность",
  "Торговля",
  "АПК",
  "Строительство",
  "Логистика",
  "Услуги",
];
const tasks = [
  "Меры поддержки",
  "Свободная экономическая зона",
  "Подготовка документа",
  "Закупки и тендеры",
  "Обращение в Союз",
  "Услуги Союза",
];

export function TelegramBusinessNavigator() {
  const [messages, setMessages] = useState<BusinessNavigatorMessage[]>([greeting]);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastActivity, setLastActivity] = useState(() => Date.now());
  const [profile, setProfile] = useState<BusinessNavigatorProfile>({
    region: "Запорожская область",
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    organization: "",
    contact: "",
    subject: "Обращение из Telegram: Бизнес-навигатор",
    message: "",
  });
  const [contactFeedback, setContactFeedback] = useState("");
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.Telegram?.WebApp?.ready?.();
    window.Telegram?.WebApp?.expand?.();
    window.Telegram?.WebApp?.MainButton?.hide?.();
  }, []);

  useEffect(() => {
    try {
      const storedProfile = window.localStorage.getItem(profileStorageKey);

      if (storedProfile) {
        setProfile((current) => ({
          ...current,
          ...(JSON.parse(storedProfile) as BusinessNavigatorProfile),
        }));
      }
    } catch {
      window.localStorage.removeItem(profileStorageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
  }, [profile]);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const touchActivity = () => setLastActivity(Date.now());

  const updateProfile = (key: keyof BusinessNavigatorProfile, value: string) => {
    touchActivity();
    setProfile((current) => ({
      ...current,
      [key]: current[key] === value ? undefined : value,
    }));
  };

  const updateProfileText = (
    key: keyof BusinessNavigatorProfile,
    value: string,
  ) => {
    touchActivity();
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const profileScore = useMemo(() => getProfileScore(profile), [profile]);
  const personalRecommendations = useMemo(
    () => getPersonalRecommendations(profile),
    [profile],
  );

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText || isLoading) {
      return;
    }

    touchActivity();
    setFeedback("");
    setInput("");

    const nextMessages: BusinessNavigatorMessage[] = [
      ...messages,
      { role: "user", content: trimmedText },
    ];

    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/business-navigator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.filter((message) => message !== greeting),
          profile,
        }),
      });

      const result = (await response.json()) as NavigatorApiResponse;

      if (!response.ok || !result.ok || !result.answer) {
        setFeedback(result.message || "Навигатор временно недоступен.");
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

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    touchActivity();

    if (!contactForm.name || !contactForm.contact || !contactForm.subject) {
      setContactFeedback("Заполните имя, контакт и тему обращения.");
      return;
    }

    setIsContactSubmitting(true);
    setContactFeedback("");

    const profileText = [
      profile.region ? `Регион: ${profile.region}` : "",
      profile.businessForm ? `Форма: ${profile.businessForm}` : "",
      profile.sphere ? `Сфера: ${profile.sphere}` : "",
      profile.task ? `Задача: ${profile.task}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contactForm,
          message: [profileText, contactForm.message].filter(Boolean).join("\n\n"),
        }),
      });

      const result = (await response.json()) as ContactApiResponse;

      if (!response.ok || !result.ok) {
        setContactFeedback(
          result.message || "Не удалось отправить обращение. Попробуйте ещё раз.",
        );
        return;
      }

      setContactFeedback(result.message || "Обращение отправлено.");
      setContactForm({
        name: "",
        organization: "",
        contact: "",
        subject: "Обращение из Telegram: Бизнес-навигатор",
        message: "",
      });

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch {
      setContactFeedback("Не удалось отправить обращение. Проверьте соединение.");
    } finally {
      setIsContactSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-[#eef3f7] text-[#102339]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,#0d2237,#143d62)] px-5 py-6 text-white shadow-[0_22px_70px_rgba(8,24,40,0.2)] sm:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#f1c88d]">
            Telegram Web App
          </p>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
                Бизнес-навигатор Союза
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/74">
                Быстрая первая линия помощи для предпринимателей: меры поддержки,
                СЭЗ, документы, закупки, услуги Союза и понятный маршрут обращения.
              </p>
            </div>
            <div className="rounded-3xl border border-white/12 bg-white/7 p-4 text-sm leading-6 text-white/72">
              Навигатор не заменяет юриста или госорган, но помогает собрать вводные,
              понять следующий шаг и направить вопрос на рассмотрение.
            </div>
          </div>
        </header>

        <main className="grid flex-1 gap-4 py-4 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-4">
            <div className="rounded-[28px] border border-white bg-white p-5 shadow-[0_18px_60px_rgba(14,28,45,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9f7440]">
                Карточка бизнеса
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                Закрепите вводные, чтобы навигатор отвечал предметнее.
              </h2>
              <div className="mt-4 rounded-2xl border border-[#d8e1e8] bg-[#f5f8fb] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#102339]">
                    Заполненность профиля
                  </p>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#143f66]">
                    {profileScore}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dbe5ee]">
                  <div
                    className="h-full rounded-full bg-[#143f66] transition-all duration-500"
                    style={{ width: `${profileScore}%` }}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-[#4d6177]">
                  Данные хранятся на устройстве и используются только для более
                  точных подсказок, маршрутов и обращений.
                </p>
              </div>
              <div className="mt-4 grid gap-3">
                <input
                  value={profile.companyName ?? ""}
                  onChange={(event) =>
                    updateProfileText("companyName", event.target.value)
                  }
                  className="navigator-input"
                  placeholder="Название компании или проекта"
                />
                <input
                  value={profile.inn ?? ""}
                  onChange={(event) => updateProfileText("inn", event.target.value)}
                  className="navigator-input"
                  placeholder="ИНН организации или ИП"
                />
                <textarea
                  value={profile.projectSummary ?? ""}
                  onChange={(event) =>
                    updateProfileText("projectSummary", event.target.value)
                  }
                  className="navigator-input min-h-24 resize-y"
                  placeholder="Кратко опишите задачу: что хотите запустить, оформить или уточнить"
                />
              </div>
              <ProfileGroup
                title="Регион"
                items={regions}
                selected={profile.region}
                onSelect={(value) => updateProfile("region", value)}
              />
              <ProfileGroup
                title="Форма"
                items={forms}
                selected={profile.businessForm}
                onSelect={(value) => updateProfile("businessForm", value)}
              />
              <ProfileGroup
                title="Размер команды"
                items={employees}
                selected={profile.employees}
                onSelect={(value) => updateProfile("employees", value)}
              />
              <ProfileGroup
                title="Стадия"
                items={projectStages}
                selected={profile.projectStage}
                onSelect={(value) => updateProfile("projectStage", value)}
              />
              <ProfileGroup
                title="Сфера"
                items={spheres}
                selected={profile.sphere}
                onSelect={(value) => updateProfile("sphere", value)}
              />
              <ProfileGroup
                title="Задача"
                items={tasks}
                selected={profile.task}
                onSelect={(value) => {
                  updateProfile("task", value);
                  setContactForm((current) => ({
                    ...current,
                    subject: `Обращение из Telegram: ${value}`,
                  }));
                }}
              />
            </div>

            <div className="rounded-[28px] border border-white bg-white p-5 shadow-[0_18px_60px_rgba(14,28,45,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9f7440]">
                Персональный маршрут
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                Что может быть полезно именно сейчас
              </h2>
              <div className="mt-4 space-y-3">
                {personalRecommendations.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => void sendMessage(item.prompt)}
                    className="w-full cursor-pointer rounded-2xl border border-[#d8e1e8] bg-[#f5f8fb] p-4 text-left transition hover:border-[#6f94b6] hover:bg-white"
                  >
                    <span className="block text-sm font-semibold text-[#102339]">
                      {item.title}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-[#4d6177]">
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleContactSubmit}
              className="rounded-[28px] border border-white bg-white p-5 shadow-[0_18px_60px_rgba(14,28,45,0.08)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9f7440]">
                Приёмная Союза
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                Оставить обращение
              </h2>
              <div className="mt-4 grid gap-3">
                <input
                  value={contactForm.name}
                  onChange={(event) =>
                    setContactForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="navigator-input"
                  placeholder="Ф.И.О."
                />
                <input
                  value={contactForm.organization}
                  onChange={(event) =>
                    setContactForm((current) => ({
                      ...current,
                      organization: event.target.value,
                    }))
                  }
                  className="navigator-input"
                  placeholder="Организация"
                />
                <input
                  value={contactForm.contact}
                  onChange={(event) =>
                    setContactForm((current) => ({
                      ...current,
                      contact: event.target.value,
                    }))
                  }
                  className="navigator-input"
                  placeholder="Телефон или email"
                />
                <input
                  value={contactForm.subject}
                  onChange={(event) =>
                    setContactForm((current) => ({
                      ...current,
                      subject: event.target.value,
                    }))
                  }
                  className="navigator-input"
                  placeholder="Тема обращения"
                />
                <textarea
                  value={contactForm.message}
                  onChange={(event) =>
                    setContactForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  className="navigator-input min-h-28 resize-y"
                  placeholder="Кратко опишите задачу"
                />
              </div>
              {contactFeedback ? (
                <p className="mt-3 text-sm leading-6 text-[#4d6177]">
                  {contactFeedback}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={isContactSubmitting}
                className="mt-4 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-[#143f66] px-5 text-sm font-semibold text-white transition hover:bg-[#1b5f97] disabled:cursor-wait disabled:opacity-70"
              >
                {isContactSubmitting ? "Отправка..." : "Направить обращение"}
              </button>
            </form>
          </section>

          <section className="flex min-h-[38rem] flex-col overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_18px_60px_rgba(14,28,45,0.08)]">
            <div className="border-b border-[var(--color-line)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9f7440]">
                Чат-навигатор
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {businessNavigatorSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    className="cursor-pointer rounded-full border border-[#c9d5df] bg-[#eef4f9] px-3 py-2 text-left text-xs font-semibold text-[#102339] transition hover:border-[#6f94b6] hover:bg-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-[#f5f8fb] p-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}-${message.content.slice(0, 14)}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-[#143f66] text-white"
                        : "border border-[#d8e1e8] bg-white text-[#102339]"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-[#d8e1e8] bg-white px-4 py-3 text-sm text-[#4d6177]">
                    Навигатор готовит ответ...
                  </div>
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-[var(--color-line)] p-4">
              {feedback ? (
                <p className="mb-3 text-sm leading-6 text-[#4d6177]">{feedback}</p>
              ) : null}
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    touchActivity();
                  }}
                  className="min-w-0 flex-1 rounded-full border border-[#c9d5df] bg-[#eef3f7] px-4 py-3 text-sm text-[#102339] outline-none transition focus:border-[#1b5f97]"
                  placeholder="Напишите вопрос"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-[#143f66] text-white transition hover:bg-[#1b5f97] disabled:cursor-not-allowed disabled:opacity-55"
                  aria-label="Отправить вопрос"
                >
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
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function ProfileGroup({
  title,
  items,
  selected,
  onSelect,
}: {
  title: string;
  items: string[];
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-sm font-semibold text-[#4d6177]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            className={`cursor-pointer rounded-full border px-3 py-2 text-sm transition ${
              selected === item
                ? "border-[#143f66] bg-[#143f66] text-white"
                : "border-[#d4dde5] bg-[#eef4f9] text-[#4d6177] hover:border-[#6f94b6] hover:bg-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

type NavigatorRecommendation = {
  title: string;
  text: string;
  prompt: string;
};

function getProfileScore(profile: BusinessNavigatorProfile) {
  const importantFields: Array<keyof BusinessNavigatorProfile> = [
    "companyName",
    "inn",
    "region",
    "businessForm",
    "employees",
    "sphere",
    "projectStage",
    "task",
    "projectSummary",
  ];

  const filledCount = importantFields.filter((field) => {
    const value = profile[field];

    return typeof value === "string" && value.trim().length > 0;
  }).length;

  return Math.round((filledCount / importantFields.length) * 100);
}

function getPersonalRecommendations(
  profile: BusinessNavigatorProfile,
): NavigatorRecommendation[] {
  const recommendations: NavigatorRecommendation[] = [];
  const company = profile.companyName || "моей компании";
  const region = profile.region || "моего региона";
  const sphere = profile.sphere || "моей сферы";
  const task = profile.task || "моей текущей задачи";

  if (getProfileScore(profile) < 45) {
    recommendations.push({
      title: "Сначала уточнить вводные",
      text: "Навигатор поможет быстро собрать профиль бизнеса и понять, какие вопросы стоит подготовить для Союза.",
      prompt:
        "Помоги мне заполнить карточку бизнеса для подбора маршрута поддержки. Задавай вопросы по одному.",
    });
  }

  if (profile.sphere === "Промышленность" || task.includes("Услуги")) {
    recommendations.push({
      title: "Промышленный маршрут",
      text: "Проверим, могут ли быть полезны реестр Минпромторга, 719-ФЗ, сертификация, техническая документация или экспертное сопровождение.",
      prompt: `Составь первичный промышленный маршрут для ${company}: регион ${region}, сфера ${sphere}, задача ${task}. Отдельно проверь 719-ФЗ, реестр Минпромторга, сертификацию и техническую документацию.`,
    });
  }

  if (
    profile.task === "Свободная экономическая зона" ||
    profile.projectStage === "Инвестпроект"
  ) {
    recommendations.push({
      title: "Инвестиционный контур",
      text: "Сформируем перечень вопросов по площадке, документам, партнёрам, кооперации и возможному обращению.",
      prompt: `Подготовь маршрут по инвестиционному проекту для ${company} в регионе ${region}. Нужны шаги, документы, вопросы для уточнения и формат обращения в Союз.`,
    });
  }

  if (
    profile.task === "Подготовка документа" ||
    profile.projectStage === "Документы к подаче"
  ) {
    recommendations.push({
      title: "Пакет документов",
      text: "Определим, какие исходные данные нужны для обращения, экспертизы, сертификатов или делового письма.",
      prompt: `Помоги определить комплект документов и исходных данных для ${company}. Регион: ${region}. Сфера: ${sphere}. Задача: ${task}.`,
    });
  }

  if (profile.sphere === "Торговля" || profile.task === "Закупки и тендеры") {
    recommendations.push({
      title: "Торговые и кооперационные связи",
      text: "Разберём, какие форматы взаимодействия, партнёрства и деловой коммуникации могут быть полезны.",
      prompt: `Предложи практический маршрут по торговым и кооперационным связям для ${company}: регион ${region}, задача ${task}.`,
    });
  }

  recommendations.push({
    title: "Сформировать обращение",
    text: "На основе карточки можно подготовить короткое, понятное обращение в Союз без лишней канцелярии.",
    prompt: `Подготовь проект обращения в Союз по моей ситуации. Компания: ${company}. Регион: ${region}. Форма: ${profile.businessForm || "не указана"}. Сфера: ${sphere}. Стадия: ${profile.projectStage || "не указана"}. Задача: ${task}. Описание: ${profile.projectSummary || "не указано"}.`,
  });

  return recommendations.slice(0, 4);
}
