import type { Metadata } from "next";

import AboutPage, { generateAboutMetadata } from "@nestino/villa-site/routes/about-page";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generateAboutMetadata({ params: props.params, pathPrefix: "" });
}

export default function Page(props: Props) {
  return <AboutPage params={props.params} pathPrefix="" />;
}
