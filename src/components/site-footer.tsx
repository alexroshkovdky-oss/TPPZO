import Link from "next/link";

import { contactMailto, siteContent } from "@/lib/site-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-deep)] text-white">
      <div className="site-container grid gap-10 py-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
            Союз и реквизиты
          </p>
          <div className="space-y-3">
            <h2 className="max-w-2xl text-2xl font-semibold tracking-[-0.04em]">
              {siteContent.name}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-white/68">
              {siteContent.footerNote}
            </p>
          </div>

          <div className="grid gap-4 text-sm text-white/78 sm:grid-cols-2">
            <p>ИНН {siteContent.legal.inn}</p>
            <p>КПП {siteContent.legal.kpp}</p>
            <p>ОГРН {siteContent.legal.ogrn}</p>
            <p>ОКПО {siteContent.legal.okpo}</p>
            <p className="sm:col-span-2">Адрес: {siteContent.legal.address}</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
            Контакты
          </p>
          <div className="space-y-3 text-sm leading-7 text-white/76">
            <p>
              Email:{" "}
              <a href={contactMailto} className="text-white transition hover:text-[#f1c88d]">
                {siteContent.contacts.email}
              </a>
            </p>
            <p>{siteContent.contacts.phoneLabel}</p>
            <p>{siteContent.legal.okved}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/contacts"
              className="button-footer"
            >
              Связаться
            </Link>
            <Link
              href="/privacy"
              className="button-footer"
            >
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
