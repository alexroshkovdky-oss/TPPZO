import { NextResponse } from "next/server";
import { Resend } from "resend";

import { siteContent } from "@/lib/site-content";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  organization?: string;
  contact?: string;
  subject?: string;
  message?: string;
};

type ContactResponse =
  | {
      ok: true;
      message: string;
      redirectUrl?: string;
    }
  | {
      ok: false;
      message: string;
    };

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    return null;
  }

  return { apiKey, from };
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;

  const name = payload.name?.trim() ?? "";
  const organization = payload.organization?.trim() ?? "";
  const contact = payload.contact?.trim() ?? "";
  const subject = payload.subject?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!name || !contact || !subject) {
    return NextResponse.json(
      {
        ok: false,
        message: "Заполните имя, контакт и тему обращения.",
      },
      { status: 400 },
    );
  }

  const recipient = process.env.CONTACT_RECIPIENT ?? siteContent.contacts.email;
  const textBody = [
    `Имя: ${name}`,
    `Организация: ${organization || "не указана"}`,
    `Контакт: ${contact}`,
    `Тема: ${subject}`,
    "",
    message || "Комментарий не указан.",
  ].join("\n");

  const resendConfig = getResendConfig();

  if (!resendConfig) {
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
      `Обращение с сайта: ${subject}`,
    )}&body=${encodeURIComponent(textBody)}`;

    return NextResponse.json<ContactResponse>({
      ok: true,
      message:
        "Почтовая отправка через Resend ещё не настроена. Откроется подготовленное письмо на официальный адрес Союза.",
      redirectUrl: mailtoUrl,
    });
  }

  const resend = new Resend(resendConfig.apiKey);

  const htmlBody = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#12263d;line-height:1.65;">
      <h2 style="margin:0 0 16px;">Новое обращение с сайта Союза</h2>
      <p><strong>Имя:</strong> ${escapeHtml(name)}</p>
      <p><strong>Организация:</strong> ${escapeHtml(organization || "не указана")}</p>
      <p><strong>Контакт:</strong> ${escapeHtml(contact)}</p>
      <p><strong>Тема:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Комментарий:</strong></p>
      <p>${escapeHtml(message || "Комментарий не указан.").replace(/\n/g, "<br />")}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: resendConfig.from,
      to: recipient,
      subject: `Обращение с сайта: ${subject}`,
      text: textBody,
      html: htmlBody,
      replyTo: contact.includes("@") ? contact : undefined,
    });

    return NextResponse.json<ContactResponse>({
      ok: true,
      message: `Обращение отправлено на ${recipient}.`,
    });
  } catch (error) {
    console.error("contact form send error", error);

    return NextResponse.json<ContactResponse>(
      {
        ok: false,
        message:
          "Не удалось отправить обращение. Проверьте настройки Resend и попробуйте ещё раз.",
      },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
