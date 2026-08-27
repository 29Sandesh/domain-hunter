export interface RegistrarLink {
  name: string;
  url: string;
  price: string;
  renewalPrice?: string;
  logoColor: string;
  badge?: string;
  isCheapest?: boolean;
}

// Typical registrar pricing matrix per TLD
const REGISTRAR_PRICING: Record<string, Record<string, { price: number; renewal: number; badge?: string }>> = {
  ".com": {
    Porkbun: { price: 10.37, renewal: 10.37, badge: "Cheapest" },
    Dynadot: { price: 10.25, renewal: 11.85 },
    Namecheap: { price: 10.28, renewal: 14.58, badge: "Popular" },
    Hostinger: { price: 9.99, renewal: 15.99 },
    GoDaddy: { price: 12.17, renewal: 21.99 },
  },
  ".ai": {
    Porkbun: { price: 68.00, renewal: 68.00, badge: "Cheapest" },
    Dynadot: { price: 67.99, renewal: 69.99 },
    Namecheap: { price: 69.98, renewal: 79.98 },
    Hostinger: { price: 74.99, renewal: 79.99 },
    GoDaddy: { price: 79.99, renewal: 89.99 },
  },
  ".io": {
    Porkbun: { price: 39.50, renewal: 39.50, badge: "Cheapest" },
    Dynadot: { price: 39.99, renewal: 44.99 },
    Namecheap: { price: 41.98, renewal: 49.98, badge: "Popular" },
    Hostinger: { price: 42.99, renewal: 54.99 },
    GoDaddy: { price: 49.99, renewal: 59.99 },
  },
  ".co": {
    Porkbun: { price: 10.98, renewal: 26.98, badge: "Cheapest" },
    Dynadot: { price: 10.99, renewal: 27.99 },
    Namecheap: { price: 11.98, renewal: 28.98 },
    Hostinger: { price: 11.99, renewal: 29.99 },
    GoDaddy: { price: 12.99, renewal: 34.99 },
  },
  ".app": {
    Porkbun: { price: 14.50, renewal: 14.50, badge: "Cheapest" },
    Dynadot: { price: 14.00, renewal: 15.00 },
    Namecheap: { price: 14.98, renewal: 16.98 },
    Hostinger: { price: 15.99, renewal: 18.99 },
    GoDaddy: { price: 16.99, renewal: 22.99 },
  },
  ".dev": {
    Porkbun: { price: 12.50, renewal: 12.50, badge: "Cheapest" },
    Dynadot: { price: 12.50, renewal: 14.00 },
    Namecheap: { price: 13.98, renewal: 15.98 },
    Hostinger: { price: 14.99, renewal: 17.99 },
    GoDaddy: { price: 15.99, renewal: 21.99 },
  },
  ".in": {
    Hostinger: { price: 7.99, renewal: 9.99, badge: "Cheapest" },
    Dynadot: { price: 8.00, renewal: 9.50 },
    Porkbun: { price: 8.50, renewal: 8.50 },
    Namecheap: { price: 8.98, renewal: 11.98 },
    GoDaddy: { price: 9.99, renewal: 14.99 },
  },
  ".xyz": {
    Hostinger: { price: 1.99, renewal: 13.99, badge: "Promo" },
    Dynadot: { price: 2.49, renewal: 12.99 },
    Porkbun: { price: 2.50, renewal: 11.50, badge: "Cheapest Renewals" },
    Namecheap: { price: 2.98, renewal: 13.98 },
    GoDaddy: { price: 3.99, renewal: 19.99 },
  },
};

export function getRegistrarLinks(domainName: string, customTld?: string): RegistrarLink[] {
  const cleanDomain = domainName.trim().toLowerCase();
  const parts = cleanDomain.split(".");
  const tld = customTld || (parts.length > 1 ? `.${parts.slice(1).join(".")}` : ".com");

  const pricingForTld = REGISTRAR_PRICING[tld] || REGISTRAR_PRICING[".com"];

  const registrars = [
    {
      name: "Porkbun",
      url: `https://porkbun.com/checkout/search?q=${encodeURIComponent(cleanDomain)}`,
      logoColor: "#F15A24",
      info: pricingForTld.Porkbun || { price: 10.37, renewal: 10.37, badge: "Cheapest" },
    },
    {
      name: "Namecheap",
      url: `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(cleanDomain)}`,
      logoColor: "#DE3723",
      info: pricingForTld.Namecheap || { price: 10.28, renewal: 14.58, badge: "Popular" },
    },
    {
      name: "Dynadot",
      url: `https://www.dynadot.com/domain/search.html?domain=${encodeURIComponent(cleanDomain)}`,
      logoColor: "#0275D8",
      info: pricingForTld.Dynadot || { price: 10.25, renewal: 11.85 },
    },
    {
      name: "GoDaddy",
      url: `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${encodeURIComponent(cleanDomain)}`,
      logoColor: "#00A4A6",
      info: pricingForTld.GoDaddy || { price: 12.17, renewal: 21.99 },
    },
    {
      name: "Hostinger",
      url: `https://www.hostinger.com/domain-name-search?domain=${encodeURIComponent(cleanDomain)}`,
      logoColor: "#673DE6",
      info: pricingForTld.Hostinger || { price: 9.99, renewal: 15.99 },
    },
  ];

  return registrars.map((r) => ({
    name: r.name,
    url: r.url,
    price: `$${r.info.price.toFixed(2)}/yr`,
    renewalPrice: `$${r.info.renewal.toFixed(2)}/yr`,
    logoColor: r.logoColor,
    badge: r.info.badge,
    isCheapest: r.info.badge === "Cheapest",
  }));
}
