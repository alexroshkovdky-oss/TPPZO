import { ServicesShowcase } from "@/components/services-showcase";
import { createMetadata } from "@/lib/metadata";
import { serviceCatalog } from "@/lib/site-content";

export const metadata = createMetadata(
  "Услуги",
  "Каталог услуг Союза: полное организационное сопровождение профильных задач бизнеса.",
);

type PartnershipPageProps = {
  searchParams: Promise<{
    service?: string;
  }>;
};

export default async function PartnershipPage({
  searchParams,
}: PartnershipPageProps) {
  const params = await searchParams;

  return (
    <ServicesShowcase
      services={serviceCatalog}
      selectedSubject={params.service}
    />
  );
}
