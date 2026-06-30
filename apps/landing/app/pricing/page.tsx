import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing | Nestino",
  description:
    "Nestino enterprise pricing is based on property count, modules, integrations, partner network scope, and demand-engine requirements.",
  path: "/pricing",
});

export default function PricingPage() {
  return <ProductPage slug="pricing" />;
}
