/**
 * Optional path prefix for rare mount scenarios. This repo deploys at `/` with
 * locales at `/{lang}` (e.g. `/en`); `pathPrefix` is normally `""`.
 */
export function villaPath(pathPrefix: string, pathStartingWithSlash: string): string {
  if (!pathPrefix) return pathStartingWithSlash;
  return `${pathPrefix}${pathStartingWithSlash}`;
}
