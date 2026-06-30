import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Partners | Nestino",
  description:
    "Nestino connects hotels, restaurants, cafes, gyms, wellness spaces, tourism providers, and lifestyle brands into one lifestyle network.",
  path: "/partners",
});

export default function PartnersPage() {
  return <ProductPage slug="partners" />;
}
