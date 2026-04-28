import type { Metadata } from "next";

import PrivateFamilyVillasInAntalyaPage, {
  generatePrivateFamilyVillasInAntalyaMetadata,
} from "@nestino/villa-site/routes/private-family-villas-in-antalya-page";

export const revalidate = 3600;

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return generatePrivateFamilyVillasInAntalyaMetadata({
    params: Promise.resolve({ lang }),
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return (
    <PrivateFamilyVillasInAntalyaPage
      params={Promise.resolve({ lang })}
      pathPrefix=""
    />
  );
}
