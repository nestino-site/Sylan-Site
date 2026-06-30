import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Curina Lifestyle Network | Nestino",
  description:
    "Curina connects hotels with restaurants, cafes, gyms, wellness centers, cultural venues, tourism providers, and lifestyle brands.",
  path: "/curina-lifestyle-network",
});

export default function CurinaLifestyleNetworkPage() {
  return <ProductPage slug="curina-lifestyle-network" />;
}
