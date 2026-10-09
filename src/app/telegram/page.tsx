import type { Metadata } from "next";
import Script from "next/script";

import { TelegramBusinessNavigator } from "@/components/telegram-business-navigator";

export const metadata: Metadata = {
  title: "Бизнес-навигатор Союза",
  description:
    "Telegram Web App для первичной деловой навигации предпринимателей Запорожской и Херсонской областей.",
};

export default function TelegramBusinessNavigatorPage() {
  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      <TelegramBusinessNavigator />
    </>
  );
}
