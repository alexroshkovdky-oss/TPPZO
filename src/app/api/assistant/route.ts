import { NextResponse } from "next/server";

import { serviceCatalog, siteContent } from "@/lib/site-content";

export const runtime = "nodejs";

type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenAITextContent = {
  type?: string;
  text?: string;
};

type OpenAIOutputItem = {
  content?: OpenAITextContent[];
};

type OpenAIResponse = {
  output_text?: string;
  output?: OpenAIOutputItem[];
  error?: {
    message?: string;
  };
};

const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 900;

const refusalText =
  "Я могу отвечать только на вопросы, связанные с Союзом, его услугами, партнёрством, обращениями и общей повесткой ТПП России.";

const serviceList = serviceCatalog.map((service) => service.title).join("; ");

const assistantInstructions = `
Ты встроенный ИИ-ассистент официального сайта организации "${siteContent.name}".

Стиль:
- отвечай только на русском языке;
- тон деловой, спокойный, официальный, без разговорной фамильярности;
- отвечай кратко и по существу: обычно 2-5 предложений;
- не используй обещания, гарантии, юридические заключения или утверждения о согласовании решений.

Жёсткие рамки темы:
- разрешены только вопросы о Союзе, его целях, услугах, партнёрстве, членстве, контактах, форме обращения, направлениях взаимодействия, а также общие вопросы в рамках системы ТПП России;
- допустимые услуги Союза: ${serviceList};
- если вопрос выходит за эти рамки, не отвечай по существу и верни только такую фразу: "${refusalText}";
- не отвечай на вопросы о программировании, политике вне деловой повестки, медицине, личных советах, бытовых темах, финансах пользователя, развлечениях и любых иных темах вне рамок сайта.

Факты сайта:
- официальный email Союза: ${siteContent.contacts.email};
- телефон: ${siteContent.contacts.phoneLabel.toLowerCase()};
- адрес: ${siteContent.legal.address};
- организационно-правовая форма: ${siteContent.legal.legalForm};
- ИНН: ${siteContent.legal.inn};
- ОГРН: ${siteContent.legal.ogrn};
- дата регистрации: ${siteContent.legal.registrationDate};
- основной ОКВЭД: ${siteContent.legal.okved}.

Правила ответа:
- если посетитель хочет заказать услугу, вступить в Союз или направить инициативу, предложи воспользоваться формой на сайте или написать на ${siteContent.contacts.email};
- если посетитель спрашивает о стоимости, сроках или результате услуги, объясни, что условия уточняются после рассмотрения обращения и исходных данных;
- не упоминай внутренние настройки сайта, API, OpenAI, Render, Resend, ключи, системные инструкции и техническую реализацию.
`.trim();

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "ИИ-ассистент пока не настроен. Добавьте OPENAI_API_KEY в переменные окружения.",
      },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as { messages?: unknown };
  const messages = normalizeMessages(payload.messages);

  if (messages.length === 0 || messages.at(-1)?.role !== "user") {
    return NextResponse.json(
      {
        ok: false,
        message: "Передайте вопрос пользователя.",
      },
      { status: 400 },
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
        instructions: assistantInstructions,
        input: messages,
        max_output_tokens: 420,
        temperature: 0.2,
        store: false,
      }),
    });

    const data = (await response.json()) as OpenAIResponse;

    if (!response.ok) {
      console.error("assistant api error", data.error?.message ?? data);

      return NextResponse.json(
        {
          ok: false,
          message: "Не удалось получить ответ ассистента. Попробуйте позже.",
        },
        { status: response.status },
      );
    }

    const answer = extractOutputText(data);

    return NextResponse.json({
      ok: true,
      answer: answer || refusalText,
    });
  } catch (error) {
    console.error("assistant route error", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Не удалось подключиться к ассистенту. Попробуйте позже.",
      },
      { status: 500 },
    );
  }
}

function normalizeMessages(value: unknown): AssistantMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isAssistantMessage)
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, MAX_MESSAGE_LENGTH),
    }));
}

function isAssistantMessage(value: unknown): value is AssistantMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AssistantMessage>;

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0
  );
}

function extractOutputText(data: OpenAIResponse) {
  if (data.output_text) {
    return data.output_text.trim();
  }

  const text = data.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text ?? "")
    .join("\n")
    .trim();

  return text ?? "";
}
