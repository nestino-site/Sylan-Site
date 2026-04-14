import type { Metadata } from "next";

import LocationPage, { generateLocationMetadata } from "@nestino/villa-site/routes/location-page";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generateLocationMetadata({ params: props.params, pathPrefix: "" });
}

export default function Page(props: Props) {
  return <LocationPage params={props.params} pathPrefix="" />;
}
