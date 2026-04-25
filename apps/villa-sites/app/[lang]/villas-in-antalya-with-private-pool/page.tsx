import type { Metadata } from "next";

import LuxuryVillasAntalyaPrivatePoolPage, {
  generateLuxuryVillasAntalyaPrivatePoolMetadata,
} from "@nestino/villa-site/routes/luxury-villas-antalya-private-pool-page";

export const revalidate = 3600;

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return generateLuxuryVillasAntalyaPrivatePoolMetadata({
    params: Promise.resolve({ lang }),
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return (
    <LuxuryVillasAntalyaPrivatePoolPage
      params={Promise.resolve({ lang })}
      pathPrefix=""
    />
  );
}
