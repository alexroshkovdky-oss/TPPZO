import { serviceCatalog, siteContent } from "@/lib/site-content";

export type BusinessNavigatorMessage = {
  role: "user" | "assistant";
  content: string;
};

export type BusinessNavigatorProfile = {
  companyName?: string;
  inn?: string;
  region?: string;
  businessForm?: string;
  sphere?: string;
  task?: string;
  employees?: string;
  projectStage?: string;
  supportArea?: string;
  projectSummary?: string;
};

type OpenAITextContent = {
  type?: string;
  text?: string;
};

type OpenAIOutputItem = {
  content?: OpenAITextContent[];
};

type OpenAIResponse = {
  output_text?: string;
  output?: OpenAIOutputItem[];
  error?: {
    message?: string;
  };
};

const serviceList = serviceCatalog.map((service) => service.title).join("; ");

export const businessNavigatorRefusal =
  "Я могу помогать только по вопросам предпринимательства, мер поддержки, СЭЗ, документов, услуг Союза и деловой повестки Запорожской и Херсонской областей в рамках системы ТПП России.";

export const businessNavigatorSuggestions = [
  "Какие меры поддержки могут подойти бизнесу?",
  "Как понять, подходит ли проект для СЭЗ?",
  "Помогите подготовить обращение в Союз",
];

export function buildBusinessNavigatorInstructions(
  profile?: BusinessNavigatorProfile,
) {
  const profileText = [
    profile?.companyName ? `Компания/проект: ${profile.companyName}` : "",
    profile?.inn ? `ИНН: ${profile.inn}` : "",
    profile?.region ? `Регион пользователя: ${profile.region}` : "",
    profile?.businessForm ? `Форма деятельности: ${profile.businessForm}` : "",
    profile?.sphere ? `Сфера: ${profile.sphere}` : "",
    profile?.task ? `Основная задача: ${profile.task}` : "",
    profile?.employees ? `Размер команды: ${profile.employees}` : "",
    profile?.projectStage ? `Стадия проекта: ${profile.projectStage}` : "",
    profile?.supportArea ? `Интересующий формат поддержки: ${profile.supportArea}` : "",
    profile?.projectSummary ? `Краткое описание: ${profile.projectSummary}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `
Ты — "Бизнес-навигатор Союза", цифровой помощник предпринимателя при ${siteContent.name}.

Главная задача:
- помочь предпринимателю понять маршрут действий;
- объяснить доступные организационные шаги простым деловым языком;
- подсказать, какие данные и документы обычно нужны;
- при необходимости направить пользователя к форме обращения в Союз.

Стиль:
- только русский язык;
- деловой, спокойный и уважительный тон;
- без обещаний, гарантий, давления и юридически категоричных выводов;
- ответ короткий, структурный и прикладной: 3-7 пунктов или 2-5 абзацев.

Жёсткие рамки:
- отвечай только по предпринимательству, промышленности, торговле, кооперации, СЭЗ, мерам поддержки, закупкам, деловым документам, услугам Союза, членству, партнёрству и вопросам ТПП России;
- допустимые услуги Союза: ${serviceList};
- если вопрос выходит за рамки деловой повестки Союза, верни только: "${businessNavigatorRefusal}";
- не отвечай на бытовые, медицинские, развлекательные, политические вне деловой повестки, программистские и личные вопросы.

Ограничения:
- не называй себя юристом, бухгалтером, госорганом или официальным источником права;
- не выдавай юридическое заключение, налоговую консультацию или гарантию получения льгот;
- если речь о законах, льготах, СЭЗ или документах, добавляй осторожную формулировку: "Для юридически значимого решения стоит сверить актуальные требования с профильным специалистом или уполномоченным органом.";
- не придумывай точные сроки, суммы, ставки и условия, если пользователь не дал проверенный источник.

Факты Союза:
- email для связи: ${siteContent.contacts.email};
- адрес: ${siteContent.legal.address};
- правовая форма: ${siteContent.legal.legalForm};
- ИНН: ${siteContent.legal.inn};
- ОГРН: ${siteContent.legal.ogrn};

Если пользователь хочет оставить заявку:
- предложи кратко описать задачу и направить обращение через форму Web App или сайт;
- помоги сформулировать тему обращения и список данных, которые стоит приложить.

${profileText ? `Контекст анкеты пользователя:\n${profileText}` : ""}
`.trim();
}

export async function generateBusinessNavigatorAnswer({
  apiKey,
  messages,
  profile,
}: {
  apiKey: string;
  messages: BusinessNavigatorMessage[];
  profile?: BusinessNavigatorProfile;
}) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
      instructions: buildBusinessNavigatorInstructions(profile),
      input: messages,
      max_output_tokens: 620,
      temperature: 0.2,
      store: false,
    }),
  });

  const data = (await response.json()) as OpenAIResponse;

  if (!response.ok) {
    throw new Error(data.error?.message ?? "OpenAI request failed");
  }

  return extractOutputText(data) || businessNavigatorRefusal;
}

export function normalizeBusinessNavigatorMessages(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isBusinessNavigatorMessage)
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1400),
    }));
}

export function normalizeBusinessNavigatorProfile(
  value: unknown,
): BusinessNavigatorProfile | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as BusinessNavigatorProfile;

  return {
    companyName: normalizeOptionalText(candidate.companyName),
    inn: normalizeOptionalText(candidate.inn),
    region: normalizeOptionalText(candidate.region),
    businessForm: normalizeOptionalText(candidate.businessForm),
    sphere: normalizeOptionalText(candidate.sphere),
    task: normalizeOptionalText(candidate.task),
    employees: normalizeOptionalText(candidate.employees),
    projectStage: normalizeOptionalText(candidate.projectStage),
    supportArea: normalizeOptionalText(candidate.supportArea),
    projectSummary: normalizeOptionalText(candidate.projectSummary),
  };
}

function normalizeOptionalText(value: unknown) {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, 160)
    : undefined;
}

function isBusinessNavigatorMessage(
  value: unknown,
): value is BusinessNavigatorMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BusinessNavigatorMessage>;

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0
  );
}

function extractOutputText(data: OpenAIResponse) {
  if (data.output_text) {
    return data.output_text.trim();
  }

  const text = data.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text ?? "")
    .join("\n")
    .trim();

  return text ?? "";
}
