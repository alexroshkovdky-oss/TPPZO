type ServiceIconProps = {
  kind:
    | "document"
    | "certificate"
    | "graph"
    | "consulting"
    | "shield"
    | "coins"
    | "globe"
    | "briefcase";
};

export function ServiceIcon({ kind }: ServiceIconProps) {
  const base = "none";
  const blue = "#1f6ea7";
  const gold = "#f0aa1f";

  if (kind === "document") {
    return (
      <svg viewBox="0 0 96 96" className="h-20 w-20" fill={base}>
        <path d="M26 18h30l14 14v42H26z" stroke={blue} strokeWidth="3.5" />
        <path d="M56 18v15h14" stroke={gold} strokeWidth="3.5" />
        <path d="M35 48h26M35 58h18" stroke={blue} strokeWidth="3.5" />
      </svg>
    );
  }

  if (kind === "certificate") {
    return (
      <svg viewBox="0 0 96 96" className="h-20 w-20" fill={base}>
        <rect x="24" y="20" width="40" height="52" stroke={blue} strokeWidth="3.5" />
        <circle cx="63" cy="58" r="12" stroke={gold} strokeWidth="3.5" />
        <path d="m59 58 3 3 7-8" stroke={gold} strokeWidth="3.5" />
      </svg>
    );
  }

  if (kind === "graph") {
    return (
      <svg viewBox="0 0 96 96" className="h-20 w-20" fill={base}>
        <path d="M24 72V24M24 72h48" stroke={blue} strokeWidth="3.5" />
        <path d="M32 60 45 46l10 8 15-20" stroke={gold} strokeWidth="3.5" />
        <path d="m66 34 4-1-1 4" stroke={gold} strokeWidth="3.5" />
      </svg>
    );
  }

  if (kind === "consulting") {
    return (
      <svg viewBox="0 0 96 96" className="h-20 w-20" fill={base}>
        <circle cx="40" cy="30" r="10" stroke={blue} strokeWidth="3.5" />
        <path d="M24 68c0-12 8-20 16-20s16 8 16 20" stroke={blue} strokeWidth="3.5" />
        <path d="M58 26h18v16H63l-5 6z" stroke={gold} strokeWidth="3.5" />
      </svg>
    );
  }

  if (kind === "shield") {
    return (
      <svg viewBox="0 0 96 96" className="h-20 w-20" fill={base}>
        <path d="M48 18 24 26v20c0 17 11 27 24 32 13-5 24-15 24-32V26z" stroke={blue} strokeWidth="3.5" />
        <circle cx="62" cy="56" r="12" stroke={gold} strokeWidth="3.5" />
        <path d="m58 56 3 3 7-8" stroke={gold} strokeWidth="3.5" />
      </svg>
    );
  }

  if (kind === "coins") {
    return (
      <svg viewBox="0 0 96 96" className="h-20 w-20" fill={base}>
        <ellipse cx="38" cy="30" rx="14" ry="8" stroke={gold} strokeWidth="3.5" />
        <path d="M24 30v18c0 4 6 8 14 8s14-4 14-8V30" stroke={gold} strokeWidth="3.5" />
        <rect x="50" y="38" width="18" height="28" stroke={blue} strokeWidth="3.5" />
      </svg>
    );
  }

  if (kind === "globe") {
    return (
      <svg viewBox="0 0 96 96" className="h-20 w-20" fill={base}>
        <circle cx="48" cy="44" r="22" stroke={blue} strokeWidth="3.5" />
        <path d="M26 44h44M48 22c6 7 10 14 10 22s-4 15-10 22M48 22c-6 7-10 14-10 22s4 15 10 22" stroke={gold} strokeWidth="3.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20" fill={base}>
      <rect x="24" y="28" width="48" height="34" rx="4" stroke={blue} strokeWidth="3.5" />
      <path d="M38 28v-6h20v6" stroke={gold} strokeWidth="3.5" />
      <path d="M24 42h48" stroke={blue} strokeWidth="3.5" />
    </svg>
  );
}
