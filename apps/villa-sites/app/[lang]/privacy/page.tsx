import type { Metadata } from "next";

import PrivacyPage, { generatePrivacyMetadata } from "@nestino/villa-site/routes/privacy-page";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generatePrivacyMetadata({ params: props.params, pathPrefix: "" });
}

export default function Page(props: Props) {
  return <PrivacyPage params={props.params} pathPrefix="" />;
}
