import type { Metadata } from "next";

import BestAreasToStayInAntalyaPage, {
  generateBestAreasToStayInAntalyaMetadata,
} from "@nestino/villa-site/routes/best-areas-to-stay-in-antalya-page";

export const revalidate = 3600;

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return generateBestAreasToStayInAntalyaMetadata({
    params: Promise.resolve({ lang }),
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  return (
    <BestAreasToStayInAntalyaPage
      params={Promise.resolve({ lang })}
      pathPrefix=""
    />
  );
}
