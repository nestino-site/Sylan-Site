import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Technology | Nestino",
  description:
    "Nestino's enterprise technology layer includes cloud services, API gateway, data layer, AI engine, analytics, security, and integrations.",
  path: "/technology",
});

export default function TechnologyPage() {
  return <ProductPage slug="technology" />;
}
