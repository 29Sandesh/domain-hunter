export interface DomainCheckResult {
  domain: string;
  name: string;
  tld: string;
  isAvailable: boolean;
  status: "AVAILABLE" | "TAKEN" | "ERROR";
  nameservers?: string[];
  checkTimeMs: number;
}

export interface RegistrarPrice {
  name: string;
  url: string;
  price: string;
  badge?: string;
}

interface DohResponse {
  Status: number; // 0 = NOERROR, 2 = SERVFAIL, 3 = NXDOMAIN
  Answer?: Array<{ name: string; type: number; TTL: number; data: string }>;
}

const REGISTRAR_PRICING: Record<string, Record<string, { price: number; badge?: string }>> = {
  ".com": {
    Porkbun: { price: 10.37, badge: "Cheapest" },
    Dynadot: { price: 10.25 },
    Namecheap: { price: 10.28, badge: "Popular" },
    Hostinger: { price: 9.99 },
    GoDaddy: { price: 12.17 },
  },
  ".ai": {
    Porkbun: { price: 68.00, badge: "Cheapest" },
    Dynadot: { price: 67.99 },
    Namecheap: { price: 69.98 },
    Hostinger: { price: 74.99 },
    GoDaddy: { price: 79.99 },
  },
  ".io": {
    Porkbun: { price: 39.50, badge: "Cheapest" },
    Dynadot: { price: 39.99 },
    Namecheap: { price: 41.98, badge: "Popular" },
    Hostinger: { price: 42.99 },
    GoDaddy: { price: 49.99 },
  },
  ".co": {
    Porkbun: { price: 10.98, badge: "Cheapest" },
    Dynadot: { price: 10.99 },
    Namecheap: { price: 11.98 },
    Hostinger: { price: 11.99 },
    GoDaddy: { price: 12.99 },
  },
  ".app": {
    Porkbun: { price: 14.50, badge: "Cheapest" },
    Dynadot: { price: 14.00 },
    Namecheap: { price: 14.98 },
    Hostinger: { price: 15.99 },
    GoDaddy: { price: 16.99 },
  },
  ".dev": {
    Porkbun: { price: 12.50, badge: "Cheapest" },
    Dynadot: { price: 12.50 },
    Namecheap: { price: 13.98 },
    Hostinger: { price: 14.99 },
    GoDaddy: { price: 15.99 },
  },
  ".in": {
    Hostinger: { price: 7.99, badge: "Cheapest" },
    Dynadot: { price: 8.00 },
    Porkbun: { price: 8.50 },
    Namecheap: { price: 8.98 },
    GoDaddy: { price: 9.99 },
  },
};

/**
 * Fast DNS-over-HTTPS resolution via Cloudflare & Google (sub-50ms)
 */
export async function checkDomainAvailability(fullDomain: string): Promise<DomainCheckResult> {
  const startTime = Date.now();
  const cleanDomain = fullDomain.trim().toLowerCase();
  const parts = cleanDomain.split(".");
  const tld = parts.length > 1 ? `.${parts.slice(1).join(".")}` : ".com";
  const name = parts[0];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1600);

    const cfUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanDomain)}&type=NS`;
    const res = await fetch(cfUrl, {
      headers: { Accept: "application/dns-json" },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as DohResponse;
      if (data.Status === 3) {
        return {
          domain: cleanDomain,
          name,
          tld,
          isAvailable: true,
          status: "AVAILABLE",
          checkTimeMs: Date.now() - startTime,
        };
      }
      if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
        const nsList = data.Answer.filter((a) => a.type === 2).map((a) => a.data.replace(/\.$/, ""));
        return {
          domain: cleanDomain,
          name,
          tld,
          isAvailable: false,
          status: "TAKEN",
          nameservers: nsList,
          checkTimeMs: Date.now() - startTime,
        };
      }
      if (data.Status === 2) {
        return {
          domain: cleanDomain,
          name,
          tld,
          isAvailable: false,
          status: "TAKEN",
          checkTimeMs: Date.now() - startTime,
        };
      }
    }
  } catch {
    // Fallback
  }

  // Backup Google DNS
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1600);

    const googleUrl = `https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=NS`;
    const res = await fetch(googleUrl, {
      headers: { Accept: "application/dns-json" },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as DohResponse;
      if (data.Status === 3) {
        return {
          domain: cleanDomain,
          name,
          tld,
          isAvailable: true,
          status: "AVAILABLE",
          checkTimeMs: Date.now() - startTime,
        };
      }
      if ((data.Status === 0 && data.Answer?.length) || data.Status === 2) {
        return {
          domain: cleanDomain,
          name,
          tld,
          isAvailable: false,
          status: "TAKEN",
          checkTimeMs: Date.now() - startTime,
        };
      }
    }
  } catch {
    // Fallback
  }

  return {
    domain: cleanDomain,
    name,
    tld,
    isAvailable: false,
    status: "TAKEN",
    checkTimeMs: Date.now() - startTime,
  };
}

/**
 * Returns registrar links and pricing comparison
 */
export function getRegistrarPricing(domainName: string, customTld?: string): RegistrarPrice[] {
  const cleanDomain = domainName.trim().toLowerCase();
  const parts = cleanDomain.split(".");
  const tld = customTld || (parts.length > 1 ? `.${parts.slice(1).join(".")}` : ".com");

  const pricing = REGISTRAR_PRICING[tld] || REGISTRAR_PRICING[".com"];

  return [
    {
      name: "Porkbun",
      url: `https://porkbun.com/checkout/search?q=${encodeURIComponent(cleanDomain)}`,
      price: `$${(pricing.Porkbun?.price || 10.37).toFixed(2)}/yr`,
      badge: pricing.Porkbun?.badge,
    },
    {
      name: "Namecheap",
      url: `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(cleanDomain)}`,
      price: `$${(pricing.Namecheap?.price || 10.28).toFixed(2)}/yr`,
      badge: pricing.Namecheap?.badge,
    },
    {
      name: "Dynadot",
      url: `https://www.dynadot.com/domain/search.html?domain=${encodeURIComponent(cleanDomain)}`,
      price: `$${(pricing.Dynadot?.price || 10.25).toFixed(2)}/yr`,
    },
    {
      name: "Hostinger",
      url: `https://www.hostinger.com/domain-name-search?domain=${encodeURIComponent(cleanDomain)}`,
      price: `$${(pricing.Hostinger?.price || 9.99).toFixed(2)}/yr`,
    },
    {
      name: "GoDaddy",
      url: `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${encodeURIComponent(cleanDomain)}`,
      price: `$${(pricing.GoDaddy?.price || 12.17).toFixed(2)}/yr`,
    },
  ];
}
