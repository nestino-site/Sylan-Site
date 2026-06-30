import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Platform | Nestino",
  description:
    "Explore Nestino's connected hospitality platform for operations, guest identity, Curina, demand, analytics, APIs, and network intelligence.",
  path: "/platform",
});

export default function PlatformPage() {
  return <ProductPage slug="platform" />;
}
