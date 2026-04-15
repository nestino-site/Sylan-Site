import type { Metadata } from "next";

import VillasIndexPage, {
  generateVillasIndexMetadata,
} from "@nestino/villa-site/routes/villas-index";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return generateVillasIndexMetadata({
    params: Promise.resolve({ lang }),
    pathPrefix: "",
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <VillasIndexPage params={Promise.resolve({ lang })} pathPrefix="" />;
}