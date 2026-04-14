"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo } from "react";

import { htmlLang, isLang, isRtl, type Lang } from "../lib/i18n";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type VillaHtmlDirPattern = "path-lang" | "sites-prefixed";

function langFromPathname(
  pathname: string,
  pattern: VillaHtmlDirPattern
): Lang | null {
  const segments = pathname.split("/").filter(Boolean);
  if (pattern === "path-lang") {
    const first = segments[0];
    return first && isLang(first) ? first : null;
  }
  if (segments[0] === "sites" && segments.length >= 3) {
    const maybe = segments[2];
    return maybe && isLang(maybe) ? maybe : null;
  }
  return null;
}

type Props = { pattern: VillaHtmlDirPattern };

/**
 * Next.js client navigations do not always refresh root `<html dir/lang>`.
 * Syncs `document.documentElement` from the URL so Tailwind `rtl:` variants
 * and native layout update immediately when switching languages.
 */
export function VillaHtmlDirSync({ pattern }: Props) {
  const pathname = usePathname() ?? "";
  const lang = useMemo(
    () => langFromPathname(pathname, pattern),
    [pathname, pattern]
  );

  useIsomorphicLayoutEffect(() => {
    if (!lang) return;
    document.documentElement.setAttribute("dir", isRtl(lang) ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", htmlLang(lang));
  }, [lang]);

  return null;
}
