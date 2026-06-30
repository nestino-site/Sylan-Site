import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Guest Identity | Nestino",
  description:
    "Nestino unifies guest profiles across hotels, restaurants, gyms, cafes, spa, events, retail, and partner experiences.",
  path: "/guest-identity",
});

export default function GuestIdentityPage() {
  return <ProductPage slug="guest-identity" />;
}
