"use client";

import { useEffect, useState } from "react";

type HeroMediaItem = {
  href: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  theme: "expertise" | "tpprf" | "tass" | "vk" | "registry";
};

type HeroMediaCarouselProps = {
  items: readonly HeroMediaItem[];
};

const themeMap: Record<HeroMediaItem["theme"], { shell: string; accent: string }> = {
  expertise: {
    shell:
      "bg-[radial-gradient(circle_at_top_right,rgba(240,170,31,0.28),transparent_32%),linear-gradient(160deg,#16293d_0%,#0f1d2d_50%,#14263b_100%)]",
    accent: "text-[#f0aa1f]",
  },
  tpprf: {
    shell:
      "bg-[radial-gradient(circle_at_top_right,rgba(84,150,214,0.26),transparent_35%),linear-gradient(160deg,#143150_0%,#0f2237_45%,#16395c_100%)]",
    accent: "text-[#7db4db]",
  },
  tass: {
    shell:
      "bg-[radial-gradient(circle_at_top_right,rgba(235,90,90,0.18),transparent_30%),linear-gradient(155deg,#1f2a38_0%,#141d29_50%,#0e1823_100%)]",
    accent: "text-[#f29b7e]",
  },
  vk: {
    shell:
      "bg-[radial-gradient(circle_at_top_right,rgba(93,145,223,0.22),transparent_30%),linear-gradient(155deg,#15263b_0%,#102031_46%,#17314b_100%)]",
    accent: "text-[#8ab8ff]",
  },
  registry: {
    shell:
      "bg-[radial-gradient(circle_at_top_right,rgba(207,161,79,0.18),transparent_30%),linear-gradient(160deg,#18263a_0%,#102031_48%,#1d3048_100%)]",
    accent: "text-[#d8b16f]",
  },
};

const titleClassMap: Record<HeroMediaItem["theme"], string> = {
  expertise: "max-w-[11ch] text-[clamp(2.55rem,4vw,3.3rem)]",
  tpprf: "max-w-[13ch] text-[clamp(2.1rem,3.25vw,2.8rem)] leading-[1.02]",
  tass: "max-w-[10ch] text-[clamp(2.7rem,4.2vw,3.45rem)]",
  vk: "max-w-[11ch] text-[clamp(2.4rem,3.8vw,3.15rem)]",
  registry: "max-w-[12ch] text-[clamp(2.15rem,3.3vw,2.95rem)] leading-[1.02]",
};

const contentClassMap: Record<HeroMediaItem["theme"], string> = {
  expertise: "space-y-5",
  tpprf: "space-y-4 pt-3",
  tass: "space-y-5",
  vk: "space-y-5",
  registry: "space-y-4 pt-3",
};

const descriptionClassMap: Record<HeroMediaItem["theme"], string> = {
  expertise: "max-w-[30ch] text-[15px] leading-8",
  tpprf: "max-w-[42ch] text-[14px] leading-7",
  tass: "max-w-[42ch] text-[14px] leading-7",
  vk: "max-w-[30ch] text-[15px] leading-8",
  registry: "max-w-[44ch] text-[14px] leading-7",
};

export function HeroMediaCarousel({ items }: HeroMediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);

  const setSlide = (index: number) => {
    setActiveIndex(index);
    setPausedUntil(Date.now() + 10_000);
  };

  const showPrevious = () => {
    setSlide((activeIndex - 1 + items.length) % items.length);
  };

  const showNext = () => {
    setSlide((activeIndex + 1) % items.length);
  };

  useEffect(() => {
    const now = Date.now();
    const delay = pausedUntil > now ? pausedUntil - now : 7200;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activeIndex, items.length, pausedUntil]);

  const active = items[activeIndex];
  const theme = themeMap[active.theme];
  const titleClass = titleClassMap[active.theme];
  const contentClass = contentClassMap[active.theme];
  const descriptionClass = descriptionClassMap[active.theme];

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <button
        type="button"
        onClick={showPrevious}
        aria-label="Предыдущий слайд"
        className="group absolute -left-12 top-[44%] z-20 hidden -translate-y-1/2 lg:flex"
      >
        <span className="block h-9 w-9 rotate-45 border-b border-l border-white/20 transition duration-300 group-hover:border-white/56" />
      </button>

      <button
        type="button"
        onClick={showNext}
        aria-label="Следующий слайд"
        className="group absolute -right-12 top-[44%] z-20 hidden -translate-y-1/2 lg:flex"
      >
        <span className="block h-9 w-9 rotate-45 border-r border-t border-white/20 transition duration-300 group-hover:border-white/56" />
      </button>

      <a
        key={active.href}
        href={active.href}
        target="_blank"
        rel="noreferrer"
        className={`relative block h-[408px] overflow-hidden rounded-[34px] border border-white/8 ${theme.shell} px-8 py-9 shadow-[0_28px_80px_rgba(7,18,30,0.2)] animate-[heroSlideFade_760ms_cubic-bezier(0.22,1,0.36,1)] transition-transform duration-500 hover:-translate-y-0.5 sm:h-[424px]`}
      >
        <div className="absolute -right-10 -top-8 h-28 w-28 rounded-full border border-white/8" />
        <div className="absolute right-7 top-12 h-20 w-20 rounded-full border border-white/7" />
        <div className="absolute right-16 top-24 h-28 w-28 rounded-full border border-white/6" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(8,18,30,0.2))]" />

        <div className="relative flex h-full flex-col justify-center">
          <div className={`max-w-[29rem] ${contentClass}`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${theme.accent}`}>
              {active.eyebrow}
            </p>
            <h3
              className={`${titleClass} font-semibold leading-[0.95] tracking-[-0.055em] text-white`}
            >
              {active.title}
            </h3>
            <p className={`${descriptionClass} text-white/72`}>
              {active.description}
            </p>
          </div>
        </div>
      </a>

      <div className="mt-6 flex justify-center">
        <div className="relative flex items-center gap-5">
          <span
            className="pointer-events-none absolute left-0 top-0 h-3 w-9 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(${activeIndex * 52}px)` }}
          />
          {items.map((item, index) => (
            <button
              key={item.href}
              type="button"
              onClick={() => setSlide(index)}
              aria-label={`Показать слайд ${index + 1}`}
              className="relative flex h-3 w-8 items-center justify-center"
            >
              <span
                className={`h-3 w-3 rounded-full bg-white/26 transition-opacity duration-300 ${
                  activeIndex === index ? "opacity-0" : "opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
