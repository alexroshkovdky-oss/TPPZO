import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata(
  "Медиация",
  "Раздел о медиации будет опубликован позже.",
);

export default function MediationPage() {
  return (
    <>
      <PageHero
        eyebrow="Медиация"
        title="Информация появится позже"
        description="Раздел будет дополнен после подготовки материалов и определения формата публикации."
      />
    </>
  );
}
