export interface TldInfo {
  tld: string;
  name: string;
  category: "Popular" | "Tech & AI" | "Startup & Brand" | "Developer" | "Commerce" | "Regional";
  typicalPriceUsd: number;
  renewalPriceUsd: number;
  description: string;
  badge?: string;
  isPopular?: boolean;
}

export const TOP_TLDS: TldInfo[] = [
  {
    tld: ".com",
    name: "Commercial",
    category: "Popular",
    typicalPriceUsd: 10.98,
    renewalPriceUsd: 13.98,
    description: "The gold standard of the internet. Universally trusted & recognized.",
    badge: "Gold Standard",
    isPopular: true,
  },
  {
    tld: ".ai",
    name: "Artificial Intelligence",
    category: "Tech & AI",
    typicalPriceUsd: 68.99,
    renewalPriceUsd: 79.99,
    description: "The official extension for AI startups, machine learning & modern tech.",
    badge: "AI Trend",
    isPopular: true,
  },
  {
    tld: ".io",
    name: "Tech & SaaS",
    category: "Tech & AI",
    typicalPriceUsd: 38.98,
    renewalPriceUsd: 48.98,
    description: "Beloved by developers, API platforms, and high-growth SaaS startups.",
    badge: "SaaS Favorite",
    isPopular: true,
  },
  {
    tld: ".co",
    name: "Company & Modern",
    category: "Startup & Brand",
    typicalPriceUsd: 11.98,
    renewalPriceUsd: 26.98,
    description: "Sleek, punchy alternative to .com for startups and modern companies.",
    isPopular: true,
  },
  {
    tld: ".app",
    name: "Mobile & Web Apps",
    category: "Tech & AI",
    typicalPriceUsd: 14.98,
    renewalPriceUsd: 16.98,
    description: "Backed by Google with built-in HTTPS security requirement. Perfect for web apps.",
    badge: "HTTPS Native",
    isPopular: true,
  },
  {
    tld: ".dev",
    name: "Developers",
    category: "Developer",
    typicalPriceUsd: 12.98,
    renewalPriceUsd: 15.98,
    description: "Dedicated to software developers, open-source projects, and engineering tools.",
    badge: "Dev Favorite",
    isPopular: true,
  },
  {
    tld: ".in",
    name: "India & Innovation",
    category: "Regional",
    typicalPriceUsd: 6.99,
    renewalPriceUsd: 9.99,
    description: "Official country code for India and rapid growing digital economy ventures.",
    badge: "Fast Growing",
    isPopular: true,
  },
  {
    tld: ".xyz",
    name: "Next Gen / Web3",
    category: "Tech & AI",
    typicalPriceUsd: 2.98,
    renewalPriceUsd: 13.98,
    description: "Hyper-modern, affordable, popular for innovative concepts and Web3.",
    isPopular: true,
  },
  {
    tld: ".org",
    name: "Organization & Trust",
    category: "Popular",
    typicalPriceUsd: 9.98,
    renewalPriceUsd: 14.98,
    description: "High authority extension for foundations, non-profits, and communities.",
    isPopular: true,
  },
  {
    tld: ".net",
    name: "Network & Infra",
    category: "Popular",
    typicalPriceUsd: 11.98,
    renewalPriceUsd: 15.98,
    description: "Classic infrastructure and networking top-level domain with global credibility.",
    isPopular: true,
  },
  {
    tld: ".tech",
    name: "Technology",
    category: "Developer",
    typicalPriceUsd: 4.99,
    renewalPriceUsd: 24.99,
    description: "Explicitly signals deep tech, hardware, software, and tech blogs.",
    isPopular: false,
  },
  {
    tld: ".store",
    name: "Ecommerce",
    category: "Commerce",
    typicalPriceUsd: 3.99,
    renewalPriceUsd: 29.99,
    description: "Built for direct-to-consumer brands, merch, and online retail stores.",
    isPopular: false,
  },
  {
    tld: ".agency",
    name: "Digital Agencies",
    category: "Startup & Brand",
    typicalPriceUsd: 8.99,
    renewalPriceUsd: 24.99,
    description: "Targeted for design studios, marketing agencies, and consultancy firms.",
    isPopular: false,
  },
  {
    tld: ".space",
    name: "Creative Hubs",
    category: "Startup & Brand",
    typicalPriceUsd: 2.99,
    renewalPriceUsd: 22.99,
    description: "Open-ended, visionary domain for community spaces and creative labs.",
    isPopular: false,
  },
  {
    tld: ".me",
    name: "Personal & Portfolio",
    category: "Regional",
    typicalPriceUsd: 8.99,
    renewalPriceUsd: 19.99,
    description: "Ideal for personal websites, resumes, portfolios, and call-to-actions.",
    isPopular: false,
  },
];

export const POPULAR_TLDS = TOP_TLDS.filter((t) => t.isPopular).map((t) => t.tld);

export function getTldInfo(tldWithDot: string): TldInfo | undefined {
  const normalized = tldWithDot.startsWith(".") ? tldWithDot.toLowerCase() : `.${tldWithDot.toLowerCase()}`;
  return TOP_TLDS.find((t) => t.tld === normalized);
}
