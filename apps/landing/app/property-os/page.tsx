import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Property OS | Nestino",
  description:
    "Nestino connects PMS, housekeeping, POS, maintenance, CRM, booking, revenue management, payments, inventory, and AI.",
  path: "/property-os",
});

export default function PropertyOsPage() {
  return <ProductPage slug="property-os" />;
}
