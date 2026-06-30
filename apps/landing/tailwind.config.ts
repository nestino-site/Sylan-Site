import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F6F1",
        sand: "#EFE8DB",
        champagne: "#C8A96A",
        olive: "#4B5B4E",
        charcoal: "#262626",
        stone: "#787878",
        beige: "#E8E2D7",
        porcelain: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "hero": ["clamp(4rem, 10vw, 10rem)", { lineHeight: "0.88", letterSpacing: "-0.07em" }],
        "display": ["clamp(3.25rem, 7vw, 7.5rem)", { lineHeight: "0.92", letterSpacing: "-0.055em" }],
        "title": ["clamp(2.4rem, 5vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.045em" }],
        "section": ["clamp(2rem, 4vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.04em" }],
      },
      boxShadow: {
        "soft": "0 24px 80px rgba(38, 38, 38, 0.08)",
        "card": "0 18px 60px rgba(38, 38, 38, 0.08), 0 2px 12px rgba(38, 38, 38, 0.05)",
        "gold": "0 18px 60px rgba(200, 169, 106, 0.22)",
      },
      backgroundImage: {
        "ivory-radial": "radial-gradient(circle at 50% 0%, rgba(200,169,106,0.24), rgba(248,246,241,0) 38%)",
        "sand-linear": "linear-gradient(135deg, #F8F6F1 0%, #EFE8DB 100%)",
        "gold-line": "linear-gradient(90deg, rgba(200,169,106,0), rgba(200,169,106,0.85), rgba(200,169,106,0))",
      },
      keyframes: {
        "float-soft": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -12px, 0)" },
        },
        "line-draw": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
      },
      animation: {
        "float-soft": "float-soft 6s ease-in-out infinite",
        "pulse-gold": "pulse-gold 3s ease-in-out infinite",
      },
      maxWidth: {
        "site": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
