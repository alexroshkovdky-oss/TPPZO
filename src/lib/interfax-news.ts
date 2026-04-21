import { cache } from "react";

const INTERFAX_BUSINESS_URL = "https://www.interfax.ru/business/";
const ECONOMY_NEWS_URL = "https://www.economy.gov.ru/material/news/";
const MINPROM_NEWS_URL = "https://minpromtorg.gov.ru/press-centre/news";
const REVALIDATE_SECONDS = 60 * 60 * 8;
const REQUEST_TIMEOUT_MS = 12_000;

export type EconomicNewsItem = {
  title: string;
  description: string;
  period: string;
  sourceLabel: string;
  sourceUrl: string;
};

const decodeHtml = (value: string) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();

const stripTags = (value: string) => decodeHtml(value.replace(/<[^>]+>/g, " "));

const formatPeriod = (value: string) => {
  const normalized = value.includes("T")
    ? value
    : value.includes(".")
      ? value.split(".").reverse().join("-")
      : value;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Moscow",
  }).format(date);
};

const fetchText = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "ru-RU,ru;q=0.9,en;q=0.8",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.text();
};

const getArticleDescription = async (url: string, fallback: string) => {
  try {
    const html = await fetchText(url);
    const descriptionMatch =
      html.match(/<meta name="description" content="([^"]+)"/i) ??
      html.match(/<meta property="og:description" content="([^"]+)"/i);

    return descriptionMatch ? decodeHtml(descriptionMatch[1]) : fallback;
  } catch {
    return fallback;
  }
};

const matchNearbyDate = (html: string, index: number) => {
  const nearby = html.slice(Math.max(0, index - 320), Math.min(html.length, index + 320));

  const isoMatch = nearby.match(/\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2})?/);
  if (isoMatch) {
    return isoMatch[0];
  }

  const dotMatch = nearby.match(/\d{2}\.\d{2}\.\d{4}/);
  return dotMatch?.[0] ?? "";
};

const dedupeAndTrim = (items: EconomicNewsItem[], limit: number) => {
  const seen = new Set<string>();
  const result: EconomicNewsItem[] = [];

  for (const item of items) {
    if (seen.has(item.sourceUrl)) {
      continue;
    }

    seen.add(item.sourceUrl);
    result.push(item);

    if (result.length >= limit) {
      break;
    }
  }

  return result;
};

export const getInterfaxBusinessNews = cache(async (limit = 6): Promise<EconomicNewsItem[]> => {
  try {
    const html = await fetchText(INTERFAX_BUSINESS_URL);
    const itemRegex =
      /<time datetime="([^"]+)">[^<]*<\/time>\s*<a href="(\/business\/\d+)" title="([^"]+)"/g;

    const rawItems: Array<{ datetime: string; sourceUrl: string; title: string }> = [];
    const seen = new Set<string>();

    for (const match of html.matchAll(itemRegex)) {
      const sourceUrl = new URL(match[2], "https://www.interfax.ru").toString();

      if (seen.has(sourceUrl)) {
        continue;
      }

      seen.add(sourceUrl);
      rawItems.push({
        datetime: match[1],
        sourceUrl,
        title: decodeHtml(match[3]),
      });

      if (rawItems.length >= limit) {
        break;
      }
    }

    const enrichedItems = await Promise.all(
      rawItems.map(async (item) => ({
        title: item.title,
        description: await getArticleDescription(
          item.sourceUrl,
          "Материал открыт на сайте Интерфакса.",
        ),
        period: formatPeriod(item.datetime),
        sourceLabel: "Интерфакс",
        sourceUrl: item.sourceUrl,
      })),
    );

    return enrichedItems;
  } catch {
    return [];
  }
});

const parseOfficialFeed = async ({
  listUrl,
  hrefPattern,
  sourceLabel,
  fallbackDescription,
  limit,
}: {
  listUrl: string;
  hrefPattern: RegExp;
  sourceLabel: string;
  fallbackDescription: string;
  limit: number;
}): Promise<EconomicNewsItem[]> => {
  try {
    const html = await fetchText(listUrl);
    const items: Array<{ href: string; title: string; datetime: string }> = [];
    const seen = new Set<string>();

    for (const match of html.matchAll(hrefPattern)) {
      const rawHref = match[1];
      const title = stripTags(match[2]);

      if (!rawHref || !title || title.length < 12) {
        continue;
      }

      const sourceUrl = new URL(rawHref, listUrl).toString();

      if (sourceUrl === listUrl || seen.has(sourceUrl)) {
        continue;
      }

      seen.add(sourceUrl);
      items.push({
        href: sourceUrl,
        title,
        datetime: matchNearbyDate(html, match.index ?? 0),
      });

      if (items.length >= limit) {
        break;
      }
    }

    const enriched = await Promise.all(
      items.map(async (item) => ({
        title: item.title,
        description: await getArticleDescription(item.href, fallbackDescription),
        period: item.datetime ? formatPeriod(item.datetime) : "Официальный источник",
        sourceLabel,
        sourceUrl: item.href,
      })),
    );

    return dedupeAndTrim(enriched, limit);
  } catch {
    return [];
  }
};

const getEconomyGovNews = cache(async (limit = 3): Promise<EconomicNewsItem[]> =>
  parseOfficialFeed({
    listUrl: ECONOMY_NEWS_URL,
    hrefPattern: /<a[^>]+href="([^"]*\/material\/news\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g,
    sourceLabel: "Минэкономразвития России",
    fallbackDescription:
      "Официальная публикация Минэкономразвития России по вопросам экономической политики и деловой повестки.",
    limit,
  }),
);

const getMinpromGovNews = cache(async (limit = 3): Promise<EconomicNewsItem[]> =>
  parseOfficialFeed({
    listUrl: MINPROM_NEWS_URL,
    hrefPattern: /<a[^>]+href="([^"]*\/press-centre\/news\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g,
    sourceLabel: "Минпромторг России",
    fallbackDescription:
      "Официальная публикация Минпромторга России по вопросам промышленности, производства и отраслевого развития.",
    limit,
  }),
);

const interleaveNews = (primary: EconomicNewsItem[], reserve: EconomicNewsItem[], limit: number) => {
  const merged: EconomicNewsItem[] = [];
  let primaryIndex = 0;
  let reserveIndex = 0;

  while (merged.length < limit && (primaryIndex < primary.length || reserveIndex < reserve.length)) {
    if (primaryIndex < primary.length) {
      merged.push(primary[primaryIndex]);
      primaryIndex += 1;
    }

    if (merged.length >= limit) {
      break;
    }

    if (reserveIndex < reserve.length) {
      merged.push(reserve[reserveIndex]);
      reserveIndex += 1;
    }
  }

  return dedupeAndTrim(merged, limit);
};

export const getEconomicNewsFeed = cache(async (limit = 6): Promise<EconomicNewsItem[]> => {
  const primaryLimit = Math.max(limit, 6);
  const reserveLimit = Math.max(Math.ceil(limit / 2), 2);

  const [interfaxItems, economyItems, minpromItems] = await Promise.all([
    getInterfaxBusinessNews(primaryLimit),
    getEconomyGovNews(reserveLimit),
    getMinpromGovNews(reserveLimit),
  ]);

  const reserveItems = dedupeAndTrim([...economyItems, ...minpromItems], reserveLimit * 2);

  if (interfaxItems.length === 0) {
    return dedupeAndTrim(reserveItems, limit);
  }

  return interleaveNews(interfaxItems, reserveItems, limit);
});
