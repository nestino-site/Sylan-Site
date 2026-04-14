import type { Metadata } from "next";

import {
  VillaLangLayout,
  generateVillaLangMetadata,
} from "@nestino/villa-site/villa-lang-layout";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generateVillaLangMetadata({ ...props, pathPrefix: "" });
}

export default function Layout(props: Props) {
  return <VillaLangLayout {...props} pathPrefix="" />;
}
