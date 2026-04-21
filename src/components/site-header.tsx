"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/lib/site-content";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[rgba(244,246,248,0.92)] text-[var(--color-ink)] backdrop-blur-xl">
      <div className="site-container relative flex items-center justify-center py-3">
        <Link
          href="/"
          aria-label="На главную"
          className="absolute left-0 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-2xl transition hover:bg-white/70"
        >
          <Image
            src="/logo.png"
            alt="Логотип Союза"
            width={52}
            height={52}
            className="h-13 w-13 object-contain"
            priority
          />
        </Link>

        <nav
          aria-label="Основная навигация"
          className="hide-scrollbar -mx-1 flex items-center justify-center gap-1 overflow-x-auto pb-1"
        >
          {navItems.map((item) => {
            const matchPaths = "matchPaths" in item ? item.matchPaths : undefined;
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : matchPaths
                  ? matchPaths.some((path) => pathname.startsWith(path))
                  : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-[rgba(255,255,255,0.7)] bg-[#173454] !text-white"
                    : "border-transparent text-[var(--color-muted)] hover:border-[var(--color-line)] hover:bg-white hover:text-[var(--color-ink)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
