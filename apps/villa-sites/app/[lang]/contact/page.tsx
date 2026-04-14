import type { Metadata } from "next";

import ContactPage, { generateContactMetadata } from "@nestino/villa-site/routes/contact-page";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generateContactMetadata({ params: props.params, pathPrefix: "" });
}

export default function Page(props: Props) {
  return <ContactPage params={props.params} pathPrefix="" />;
}
