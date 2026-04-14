import type { Config } from "tailwindcss";

// Villa sites use CSS custom properties for per-tenant theming.
// Tailwind classes reference var() tokens; actual values are injected
// by the root layout based on sites.accent_hex and sites.theme.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/villa-site/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background / surface
        "v-bg": "var(--color-bg)",
        "v-surface": "var(--color-surface)",
        // Text
        "v-text": "var(--color-text-primary)",
        "v-text-secondary": "var(--color-text-secondary)",
        "v-text-muted": "var(--color-text-muted)",
        // Borders
        "v-border": "var(--color-border)",
        "v-border-strong": "var(--color-border-strong)",
        // Accent (per-tenant)
        accent: {
          DEFAULT: "var(--accent-500)",
          600: "var(--accent-600)",
          400: "var(--accent-400)",
          muted: "var(--accent-muted)",
        },
      },
      fontFamily: {
        serif: [
          "var(--font-fraunces)",
          "var(--font-noto-naskh-arabic)",
          "Georgia",
          "serif",
        ],
        sans: [
          "var(--font-inter)",
          "var(--font-noto-arabic)",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        display: ["clamp(2.25rem, 5vw, 3.5rem)", { lineHeight: "1.1", fontWeight: "600" }],
        h1: ["clamp(1.875rem, 4vw, 2.5rem)", { lineHeight: "1.15", fontWeight: "600" }],
        h2: ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["clamp(1.25rem, 2.5vw, 1.5rem)", { lineHeight: "1.25", fontWeight: "600" }],
      },
      maxWidth: {
        content: "1200px",
      },
      zIndex: {
        "sticky-header": "40",
        "sticky-cta": "45",
        "floating-wa": "50",
        lightbox: "100",
      },
      boxShadow: {
        "v-sm": "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "v-md": "0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
        "v-lg": "0 16px 48px 0 rgb(0 0 0 / 0.14), 0 4px 12px -4px rgb(0 0 0 / 0.08)",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease forwards",
        "fade-in": "fade-in 0.4s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;