import { NextResponse } from "next/server";

import {
  type BusinessNavigatorMessage,
  generateBusinessNavigatorAnswer,
  normalizeBusinessNavigatorMessages,
} from "@/lib/business-navigator";

export const runtime = "nodejs";

const telegramMemoryTtlMs = 300_000;
const telegramMemoryLimit = 8;

const telegramMemory = new Map<
  number,
  {
    updatedAt: number;
    messages: BusinessNavigatorMessage[];
  }
>();

type TelegramMessage = {
  chat?: {
    id?: number;
  };
  text?: string;
  web_app_data?: {
    data?: string;
  };
};

type TelegramUpdate = {
  message?: TelegramMessage;
};

function getAppUrl(request: Request) {
  const configuredUrl =
    process.env.TELEGRAM_WEB_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL;

  if (configuredUrl) {
    const normalizedUrl = configuredUrl.replace(/\/$/, "");

    return normalizedUrl.endsWith("/telegram")
      ? normalizedUrl
      : `${normalizedUrl}/telegram`;
  }

  return `${new URL(request.url).origin}/telegram`;
}

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (webhookSecret) {
    const incomingSecret = request.headers.get("x-telegram-bot-api-secret-token");

    if (incomingSecret !== webhookSecret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  if (!botToken) {
    return NextResponse.json(
      { ok: false, message: "TELEGRAM_BOT_TOKEN is not configured" },
      { status: 503 },
    );
  }

  const update = (await request.json()) as TelegramUpdate;
  const message = update.message;
  const chatId = message?.chat?.id;
  const text = message?.text?.trim() ?? "";
  const appUrl = getAppUrl(request);

  if (!chatId) {
    return NextResponse.json({ ok: true });
  }

  if (message?.web_app_data) {
    await sendTelegramMessage({
      botToken,
      chatId,
      text: "Данные из приложения получены. Если нужно продолжить работу, откройте Бизнес-навигатор или напишите вопрос в чат.",
      appUrl,
    });

    return NextResponse.json({ ok: true });
  }

  if (!text || text === "/start" || text === "/app") {
    if (text === "/start") {
      telegramMemory.delete(chatId);
    }

    await sendTelegramMessage({
      botToken,
      chatId,
      text:
        "Здравствуйте. Это Бизнес-навигатор Союза: помощник по мерам поддержки, СЭЗ, документам, услугам и обращениям для предпринимателей Запорожской и Херсонской областей.",
      appUrl,
    });

    return NextResponse.json({ ok: true });
  }

  if (text === "/help") {
    await sendTelegramMessage({
      botToken,
      chatId,
      text:
        "Вы можете задать вопрос в чате или открыть приложение. Навигатор работает только по деловой повестке Союза, предпринимательству, мерам поддержки, СЭЗ, документам и услугам.",
      appUrl,
    });

    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    await sendTelegramMessage({
      botToken,
      chatId,
      text:
        "ИИ-ответы пока не подключены. Откройте Бизнес-навигатор, чтобы оставить обращение в Союз.",
      appUrl,
    });

    return NextResponse.json({ ok: true });
  }

  try {
    const history = getTelegramHistory(chatId);
    const nextMessages = normalizeBusinessNavigatorMessages([
      ...history,
      {
        role: "user",
        content: text,
      },
    ]);

    const answer = await generateBusinessNavigatorAnswer({
      apiKey,
      messages: nextMessages,
    });

    setTelegramHistory(chatId, [
      ...nextMessages,
      {
        role: "assistant",
        content: answer,
      },
    ]);

    await sendTelegramMessage({
      botToken,
      chatId,
      text: answer,
      appUrl,
    });
  } catch (error) {
    console.error("telegram navigator error", error);

    await sendTelegramMessage({
      botToken,
      chatId,
      text:
        "Сейчас не удалось подготовить ответ. Попробуйте позже или откройте приложение для отправки обращения.",
      appUrl,
    });
  }

  return NextResponse.json({ ok: true });
}

function getTelegramHistory(chatId: number) {
  const existing = telegramMemory.get(chatId);

  if (!existing || Date.now() - existing.updatedAt > telegramMemoryTtlMs) {
    telegramMemory.delete(chatId);
    return [];
  }

  return existing.messages;
}

function setTelegramHistory(
  chatId: number,
  messages: BusinessNavigatorMessage[],
) {
  telegramMemory.set(chatId, {
    updatedAt: Date.now(),
    messages: messages.slice(-telegramMemoryLimit),
  });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "telegram-webhook" });
}

async function sendTelegramMessage({
  botToken,
  chatId,
  text,
  appUrl,
}: {
  botToken: string;
  chatId: number;
  text: string;
  appUrl: string;
}) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Открыть Бизнес-навигатор",
                web_app: {
                  url: appUrl,
                },
              },
            ],
          ],
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram sendMessage failed: ${errorText}`);
  }
}
