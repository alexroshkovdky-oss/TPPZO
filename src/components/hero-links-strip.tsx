import Link from "next/link";

type HeroLink = {
  href: string;
  label: string;
};

type HeroLinksStripProps = {
  items: readonly HeroLink[];
};

export function HeroLinksStrip({ items }: HeroLinksStripProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex min-h-[68px] items-center justify-center rounded-[16px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-4 py-4 text-center text-base font-medium text-white/92 transition hover:border-white/14 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] hover:text-white"
        >
          <span className="max-w-[14ch] leading-5">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
