import type { Metadata } from "next";

import VillaDetailPage, {
  generateVillaDetailMetadata,
} from "@nestino/villa-site/routes/villa-detail";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  return generateVillaDetailMetadata({
    params: Promise.resolve({ lang, slug }),
  });
}

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  return <VillaDetailPage params={{ lang, slug }} />;
}
