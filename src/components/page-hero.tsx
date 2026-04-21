type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="site-container py-20 sm:py-24">
        <div className="max-w-4xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.05em] text-[var(--color-ink)] sm:text-4xl lg:text-[3.25rem]">
            {title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--color-muted)]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
