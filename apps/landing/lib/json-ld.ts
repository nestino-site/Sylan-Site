import { siteUrl } from "@/content/site";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nestino",
    url: siteUrl,
    description:
      "Nestino is an enterprise hospitality operating system connecting property operations, guest identity, direct demand, lifestyle partners, analytics, and APIs.",
    industry: "Hospitality technology",
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nestino",
    url: siteUrl,
    potentialAction: {
      "@type": "ContactAction",
      target: `${siteUrl}/contact`,
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nestino",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Enterprise hospitality operating system for property operations, guest identity, direct demand, lifestyle networks, executive analytics, and APIs.",
    offers: {
      "@type": "Offer",
      price: "Contact",
      priceCurrency: "USD",
    },
  };
}
