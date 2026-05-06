"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/lib/site-content";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[rgba(244,246,248,0.92)] text-[var(--color-ink)] backdrop-blur-xl">
      <div className="site-container flex items-center gap-2 py-3 md:relative md:justify-center">
        <Link
          href="/"
          aria-label="На главную"
          className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition hover:bg-white/70 md:absolute md:left-0 md:top-1/2 md:h-16 md:w-16 md:-translate-y-1/2 md:rounded-2xl"
        >
          <Image
            src="/logo.png"
            alt="Логотип Союза"
            width={52}
            height={52}
            className="h-10 w-10 object-contain md:h-13 md:w-13"
            priority
          />
        </Link>

        <nav
          aria-label="Основная навигация"
          className="hide-scrollbar flex min-w-0 flex-1 items-center justify-start gap-1 overflow-x-auto pb-1 pr-1 md:-mx-1 md:w-full md:flex-none md:justify-center md:pl-0 md:pr-0"
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
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
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
