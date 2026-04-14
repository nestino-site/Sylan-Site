import type { Metadata } from "next";

import VillaHomePage, {
  generateVillaHomeMetadata,
} from "@nestino/villa-site/routes/home";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generateVillaHomeMetadata({ ...props, pathPrefix: "" });
}

export default function Page(props: Props) {
  return <VillaHomePage {...props} pathPrefix="" />;
}
