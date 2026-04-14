import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-serif font-semibold text-display text-[var(--color-text-primary)] mb-4">
        404
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        This page could not be found.
      </p>
      <Link
        href="/en"
        className="text-sm font-medium underline underline-offset-4"
        style={{ color: "var(--accent-500)" }}
      >
        Back to home
      </Link>
    </div>
  );
}