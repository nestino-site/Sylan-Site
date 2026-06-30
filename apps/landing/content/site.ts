export type Route = {
  href: string;
  label: string;
  description: string;
};

export type Pillar = {
  title: string;
  kicker: string;
  description: string;
  href: string;
  points: string[];
};

export type PageContent = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
  visual: "platform" | "property" | "identity" | "curina" | "analytics" | "technology" | "partners" | "pricing" | "about";
  sections: Array<{
    title: string;
    text: string;
    points: string[];
  }>;
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nestino.com";

export const primaryNavigation: Route[] = [
  {
    href: "/platform",
    label: "Platform",
    description: "The connected operating model for hospitality.",
  },
  {
    href: "/property-os",
    label: "Property OS",
    description: "Operations, revenue, CRM, inventory, and AI.",
  },
  {
    href: "/guest-identity",
    label: "Guest Identity",
    description: "One guest profile across every experience.",
  },
  {
    href: "/curina-lifestyle-network",
    label: "Curina",
    description: "Hotels, lifestyle partners, and local demand.",
  },
  {
    href: "/enterprise-analytics",
    label: "Analytics",
    description: "Executive visibility across the network.",
  },
  {
    href: "/technology",
    label: "Technology",
    description: "APIs, data, AI, security, and integrations.",
  },
];

export const secondaryNavigation: Route[] = [
  { href: "/partners", label: "Partners", description: "Join the connected lifestyle network." },
  { href: "/pricing", label: "Pricing", description: "Enterprise packages and implementation paths." },
  { href: "/about", label: "About", description: "Why Nestino exists." },
  { href: "/contact", label: "Contact", description: "Start an enterprise conversation." },
];

export const productPillars: Pillar[] = [
  {
    title: "Property OS",
    kicker: "Operate",
    description: "Connect the core hotel stack into one calm operational layer for teams, managers, and owners.",
    href: "/property-os",
    points: ["PMS", "Housekeeping", "POS", "Maintenance", "Revenue", "Inventory", "Payments", "AI"],
  },
  {
    title: "Guest Identity",
    kicker: "Remember",
    description: "Unify every stay, meal, workout, spa visit, retail moment, and event into one consent-aware profile.",
    href: "/guest-identity",
    points: ["Profiles", "Preferences", "Loyalty", "Personalization", "Cross-property intelligence"],
  },
  {
    title: "Curina Lifestyle Network",
    kicker: "Connect",
    description: "Turn hotels, restaurants, cafes, gyms, wellness spaces, and lifestyle brands into one intelligent ecosystem.",
    href: "/curina-lifestyle-network",
    points: ["Offers", "Points", "Recommendations", "Partner demand", "Local experiences"],
  },
  {
    title: "Autonomous Demand Engine",
    kicker: "Grow",
    description: "Continuously improve direct demand through SEO discovery, on-site optimization, AI visibility, and multilingual growth.",
    href: "/platform",
    points: ["Crawl", "Diagnose", "Decide", "Execute", "Measure", "Iterate"],
  },
  {
    title: "Executive Intelligence",
    kicker: "See",
    description: "Give leadership a live view of revenue, guest lifetime value, source mix, RevPAR, and network movement.",
    href: "/enterprise-analytics",
    points: ["Revenue", "Occupancy", "RevPAR", "GLV", "Direct booking mix", "Movement"],
  },
  {
    title: "Enterprise APIs",
    kicker: "Extend",
    description: "Expose the platform through secure APIs for integrations, partners, internal tools, and enterprise workflows.",
    href: "/technology",
    points: ["API gateway", "Data layer", "AI engine", "Security", "Integrations"],
  },
];

export const operatingModules = [
  "PMS",
  "Housekeeping",
  "POS",
  "Maintenance",
  "CRM",
  "Booking Engine",
  "Revenue Management",
  "Payments",
  "Inventory",
  "AI",
];

export const guestJourney = [
  "Boutique hotel",
  "Restaurant",
  "Gym",
  "Cafe",
  "Spa",
  "Events",
  "Retail",
  "Airport lounge",
];

export const engineLoop = ["Crawl", "Diagnose", "Decide", "Execute", "Measure", "Iterate"];

export const corporateRoutes = [
  "/",
  "/platform",
  "/property-os",
  "/guest-identity",
  "/curina-lifestyle-network",
  "/enterprise-analytics",
  "/technology",
  "/partners",
  "/pricing",
  "/about",
  "/contact",
];

export const pageContent: Record<string, PageContent> = {
  platform: {
    slug: "platform",
    eyebrow: "Platform",
    title: "One operating system for connected hospitality.",
    intro:
      "Nestino connects property operations, guest identity, direct demand, Curina partners, analytics, APIs, and AI into one intelligent hospitality network.",
    ctaLabel: "Discuss the platform",
    ctaHref: "/contact?intent=platform",
    visual: "platform",
    sections: [
      {
        title: "A network, not another dashboard",
        text:
          "Each property keeps its own character while shared intelligence compounds across the ecosystem.",
        points: ["Unified operations", "Cross-property guest intelligence", "Direct demand growth", "Partner ecosystem"],
      },
      {
        title: "The demand layer is built in",
        text:
          "Nestino's autonomous engine continuously discovers, improves, measures, and repeats across SEO, AI discovery, and multilingual demand.",
        points: ["SEO discovery", "On-site optimization", "GEO and AEO visibility", "Off-site mention gaps"],
      },
    ],
  },
  "property-os": {
    slug: "property-os",
    eyebrow: "Property OS",
    title: "A calm operating layer for every property workflow.",
    intro:
      "PMS, housekeeping, POS, maintenance, CRM, booking, revenue, payments, inventory, and AI become connected modules instead of isolated systems.",
    ctaLabel: "Explore implementation",
    ctaHref: "/contact?intent=property-os",
    visual: "property",
    sections: [
      {
        title: "Operational clarity",
        text:
          "Teams see the same guest, stay, task, revenue, and service context without jumping between disconnected tools.",
        points: ["Housekeeping state", "Maintenance routing", "POS context", "Inventory signals"],
      },
      {
        title: "Revenue-aware operations",
        text:
          "Pricing, demand signals, direct booking intent, and service behavior feed back into property decisions.",
        points: ["Revenue management", "Booking engine", "Payments", "AI recommendations"],
      },
    ],
  },
  "guest-identity": {
    slug: "guest-identity",
    eyebrow: "Guest Identity",
    title: "One guest identity across every premium experience.",
    intro:
      "Nestino turns disconnected stays, meals, wellness visits, retail moments, and events into a richer, consent-aware guest profile.",
    ctaLabel: "Design guest intelligence",
    ctaHref: "/contact?intent=identity",
    visual: "identity",
    sections: [
      {
        title: "One profile, many contexts",
        text:
          "A guest is not a duplicate record in each property. The profile becomes a living memory of preferences, intent, and experiences.",
        points: ["Stay history", "Dining preferences", "Wellness behavior", "Lifestyle signals"],
      },
      {
        title: "Personalization that feels human",
        text:
          "Better recommendations, return offers, upgrades, and partner experiences emerge from richer context.",
        points: ["Preference memory", "Cross-property recognition", "Loyalty context", "Relevant offers"],
      },
    ],
  },
  "curina-lifestyle-network": {
    slug: "curina-lifestyle-network",
    eyebrow: "Curina",
    title: "The lifestyle network around every stay.",
    intro:
      "Curina connects hotels with restaurants, cafes, gyms, wellness centers, art spaces, coworking venues, tourism providers, and lifestyle brands.",
    ctaLabel: "Become a Curina partner",
    ctaHref: "/contact?intent=curina",
    visual: "curina",
    sections: [
      {
        title: "The city becomes programmable",
        text:
          "Every partner can participate in offers, points, recommendations, and personalized guest journeys.",
        points: ["Restaurants", "Cafes", "Gyms", "Wellness", "Events", "Retail"],
      },
      {
        title: "Partners share intelligent demand",
        text:
          "Hotels and lifestyle partners no longer operate as disconnected venues. They become part of a connected local graph.",
        points: ["Partner discovery", "Guest movement", "Offer intelligence", "Profile enrichment"],
      },
    ],
  },
  "enterprise-analytics": {
    slug: "enterprise-analytics",
    eyebrow: "Enterprise Analytics",
    title: "Executive visibility across revenue, guests, and network movement.",
    intro:
      "Nestino gives leadership a clear view of revenue, occupancy, RevPAR, guest lifetime value, direct demand, source mix, and cross-property behavior.",
    ctaLabel: "See executive analytics",
    ctaHref: "/contact?intent=analytics",
    visual: "analytics",
    sections: [
      {
        title: "From property KPIs to network intelligence",
        text:
          "Executives can see what is moving, where value is leaking, and which guest journeys are compounding.",
        points: ["Revenue", "Occupancy", "RevPAR", "GLV", "Direct booking mix"],
      },
      {
        title: "AI explains the next decision",
        text:
          "Demand forecasts, pricing movement, partner performance, and direct booking probability become visible.",
        points: ["Forecasting", "Source mix", "Cross-property movement", "Partner lift"],
      },
    ],
  },
  technology: {
    slug: "technology",
    eyebrow: "Technology",
    title: "An enterprise architecture for the connected hospitality network.",
    intro:
      "Nestino is designed around APIs, a secure data layer, AI services, analytics, identity, and integrations that can scale with enterprise partners.",
    ctaLabel: "Talk to technology team",
    ctaHref: "/contact?intent=technology",
    visual: "technology",
    sections: [
      {
        title: "A layered platform",
        text:
          "Cloud services, API gateway, data layer, AI engine, analytics, security, and integration layers assemble into one architecture.",
        points: ["Cloud", "API Gateway", "Data Lake", "AI Engine", "Analytics", "Security"],
      },
      {
        title: "Designed for extensibility",
        text:
          "Enterprise APIs make it possible to connect hotel systems, partner services, internal tools, and future product surfaces.",
        points: ["Integrations", "Partner APIs", "Identity", "Observability"],
      },
    ],
  },
  partners: {
    slug: "partners",
    eyebrow: "Partners",
    title: "Join the lifestyle network around premium travel.",
    intro:
      "Nestino helps hotels and lifestyle businesses share demand, understand guests, and create connected experiences across the city.",
    ctaLabel: "Apply as a partner",
    ctaHref: "/contact?intent=partner",
    visual: "partners",
    sections: [
      {
        title: "Built for premium venues",
        text:
          "Restaurants, cafes, gyms, wellness centers, art galleries, tourism providers, and lifestyle brands become part of a connected guest journey.",
        points: ["Discovery", "Offers", "Points", "Recommendations"],
      },
      {
        title: "Better context, better demand",
        text:
          "Partners benefit from higher-intent guests and richer context without losing their own brand identity.",
        points: ["Qualified visitors", "Profile context", "Repeat visits", "Brand-safe participation"],
      },
    ],
  },
  pricing: {
    slug: "pricing",
    eyebrow: "Pricing",
    title: "Enterprise packages built around implementation, intelligence, and scale.",
    intro:
      "Nestino is not priced like a commodity SaaS widget. Packages depend on property count, integrations, network scope, and growth-engine requirements.",
    ctaLabel: "Request enterprise pricing",
    ctaHref: "/contact?intent=pricing",
    visual: "pricing",
    sections: [
      {
        title: "Implementation-led",
        text:
          "Every deployment begins with ecosystem mapping, data architecture, brand fit, and the operating workflows that matter.",
        points: ["Discovery", "Architecture", "Implementation", "Enablement"],
      },
      {
        title: "Scale with the network",
        text:
          "Pricing reflects the number of properties, modules, partner categories, data integrations, and AI demand scope.",
        points: ["Property count", "Modules", "Partner network", "Demand engine"],
      },
    ],
  },
  about: {
    slug: "about",
    eyebrow: "About",
    title: "Preserve individuality. Connect the intelligence.",
    intro:
      "Nestino exists to help independent luxury hospitality brands operate with the intelligence of a global network while preserving the soul of every property.",
    ctaLabel: "Meet Nestino",
    ctaHref: "/contact?intent=about",
    visual: "about",
    sections: [
      {
        title: "The future is connected, not standardized",
        text:
          "Great hospitality is local, emotional, and specific. Nestino gives those properties shared intelligence without turning them into copies.",
        points: ["Individual brands", "Shared intelligence", "Premium operations", "Network trust"],
      },
      {
        title: "From direct demand to operating system",
        text:
          "Nestino's first wedge is autonomous direct-demand growth. The long-term platform is the connected operating system for hospitality.",
        points: ["Demand engine", "Guest identity", "Curina", "Enterprise OS"],
      },
    ],
  },
};
