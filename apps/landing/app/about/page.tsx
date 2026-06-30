import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About | Nestino",
  description:
    "Nestino helps independent luxury hospitality brands operate with the intelligence of a connected network while preserving individuality.",
  path: "/about",
});

export default function AboutPage() {
  return <ProductPage slug="about" />;
}
