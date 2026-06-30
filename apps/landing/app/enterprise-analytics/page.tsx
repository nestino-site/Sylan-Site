import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Enterprise Analytics | Nestino",
  description:
    "Nestino gives leadership visibility into revenue, occupancy, RevPAR, guest lifetime value, direct demand, and network movement.",
  path: "/enterprise-analytics",
});

export default function EnterpriseAnalyticsPage() {
  return <ProductPage slug="enterprise-analytics" />;
}
