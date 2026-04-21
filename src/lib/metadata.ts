import type { Metadata } from "next";

import { siteContent } from "@/lib/site-content";

const defaultTitle = `${siteContent.shortName} | официальный сайт`;

export function createMetadata(
  title?: string,
  description?: string,
): Metadata {
  const resolvedTitle = title ? `${title} | ${siteContent.shortName}` : defaultTitle;
  const resolvedDescription = description ?? siteContent.descriptor;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    applicationName: siteContent.shortName,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      type: "website",
      locale: "ru_RU",
      siteName: siteContent.shortName,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteContent.name,
  description: siteContent.descriptor,
  email: siteContent.contacts.email,
  identifier: [
    {
      "@type": "PropertyValue",
      propertyID: "ИНН",
      value: siteContent.legal.inn,
    },
    {
      "@type": "PropertyValue",
      propertyID: "ОГРН",
      value: siteContent.legal.ogrn,
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: siteContent.legal.address,
    addressLocality: siteContent.contacts.city,
  },
};
