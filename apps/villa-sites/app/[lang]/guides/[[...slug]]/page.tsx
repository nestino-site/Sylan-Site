import type { Metadata } from "next";

import GuidesCatchAllPage, {
  generateGuidesCatchAllMetadata,
} from "@nestino/villa-site/routes/guides-catchall-page";

export const revalidate = 60;

type Props = { params: Promise<{ lang: string; slug?: string[] }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generateGuidesCatchAllMetadata({ params: props.params, pathPrefix: "" });
}

export default async function Page(props: Props) {
  return <GuidesCatchAllPage params={props.params} pathPrefix="" />;
}
