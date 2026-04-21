export function BrandConstellation() {
  return (
    <div className="relative aspect-[1.05/1] w-full max-w-[520px]">
      <svg
        viewBox="0 0 520 500"
        className="h-full w-full"
        aria-hidden="true"
        role="presentation"
      >
        <defs>
          <linearGradient id="union-line" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#7db4db" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f1c88d" stopOpacity="0.65" />
          </linearGradient>
          <radialGradient id="union-glow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#9fd1ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#9fd1ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="260" cy="250" r="220" fill="url(#union-glow)" />
        <circle
          cx="260"
          cy="250"
          r="174"
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1.2"
        />
        <circle
          cx="260"
          cy="250"
          r="116"
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.2"
        />

        <g stroke="url(#union-line)" strokeWidth="2">
          <path d="M125 116 L260 250 L398 112" fill="none" />
          <path d="M104 288 L260 250 L410 315" fill="none" />
          <path d="M178 408 L260 250 L336 398" fill="none" />
        </g>

        <g fill="#eff6ff">
          <circle cx="125" cy="116" r="9" />
          <circle cx="398" cy="112" r="9" />
          <circle cx="104" cy="288" r="9" />
          <circle cx="410" cy="315" r="9" />
          <circle cx="178" cy="408" r="9" />
          <circle cx="336" cy="398" r="9" />
          <circle cx="260" cy="250" r="15" fill="#f1c88d" />
        </g>

        <g
          fill="rgba(239,246,255,0.94)"
          fontFamily="var(--font-sans)"
          fontSize="18"
          fontWeight="600"
        >
          <text x="62" y="104">
            Промышленность
          </text>
          <text x="348" y="98">
            Торговля
          </text>
          <text x="40" y="324">
            Инициативы
          </text>
          <text x="343" y="342">
            Партнёрство
          </text>
          <text x="115" y="450">
            Социальные проекты
          </text>
          <text x="271" y="430">
            Межрегиональные связи
          </text>
        </g>
      </svg>
    </div>
  );
}
