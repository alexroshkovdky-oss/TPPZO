import { NextResponse } from "next/server";

import {
  businessNavigatorRefusal,
  generateBusinessNavigatorAnswer,
  normalizeBusinessNavigatorMessages,
  normalizeBusinessNavigatorProfile,
} from "@/lib/business-navigator";

export const runtime = "nodejs";

type NavigatorPayload = {
  messages?: unknown;
  profile?: unknown;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Бизнес-навигатор пока не настроен. Добавьте OPENAI_API_KEY в переменные окружения.",
      },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as NavigatorPayload;
  const messages = normalizeBusinessNavigatorMessages(payload.messages);
  const profile = normalizeBusinessNavigatorProfile(payload.profile);

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
    const answer = await generateBusinessNavigatorAnswer({
      apiKey,
      messages,
      profile,
    });

    return NextResponse.json({
      ok: true,
      answer: answer || businessNavigatorRefusal,
    });
  } catch (error) {
    console.error("business navigator error", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Не удалось получить ответ навигатора. Попробуйте позже.",
      },
      { status: 500 },
    );
  }
}
