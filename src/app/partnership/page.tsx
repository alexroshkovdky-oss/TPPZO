import { ServicesShowcase } from "@/components/services-showcase";
import { createMetadata } from "@/lib/metadata";
import { serviceCatalog } from "@/lib/site-content";

export const metadata = createMetadata(
  "Услуги",
  "Расширенные форматы услуг и взаимодействия с Союзом: инициативы, сопровождение, консультационная и организационная поддержка.",
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
