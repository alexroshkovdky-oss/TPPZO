const token = process.env.TELEGRAM_BOT_TOKEN;
const appBaseUrl = (
  process.argv[2] ||
  process.env.TELEGRAM_WEB_APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.APP_URL ||
  ""
).replace(/\/$/, "");
const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

if (!appBaseUrl) {
  throw new Error(
    "APP_URL, NEXT_PUBLIC_APP_URL, TELEGRAM_WEB_APP_URL or first CLI argument is required",
  );
}

const webAppUrl = appBaseUrl.endsWith("/telegram")
  ? appBaseUrl
  : `${appBaseUrl}/telegram`;
const webhookBaseUrl = webAppUrl.replace(/\/telegram$/, "");
const webhookUrl = `${webhookBaseUrl}/api/telegram/webhook`;

await telegram("setMyCommands", {
  commands: [
    {
      command: "start",
      description: "Запустить Бизнес-навигатор",
    },
    {
      command: "app",
      description: "Открыть Telegram-приложение",
    },
    {
      command: "help",
      description: "Как работает навигатор",
    },
  ],
});

await telegram("setChatMenuButton", {
  menu_button: {
    type: "web_app",
    text: "Бизнес-навигатор",
    web_app: {
      url: webAppUrl,
    },
  },
});

await telegram("setWebhook", {
  url: webhookUrl,
  allowed_updates: ["message"],
  ...(secretToken ? { secret_token: secretToken } : {}),
});

console.log("Telegram bot configured");
console.log(`Web App: ${webAppUrl}`);
console.log(`Webhook: ${webhookUrl}`);

async function telegram(method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(`${method} failed: ${JSON.stringify(data)}`);
  }

  return data.result;
}
