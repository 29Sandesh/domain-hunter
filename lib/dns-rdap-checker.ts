export interface DomainCheckResult {
  domain: string;
  name: string;
  tld: string;
  isAvailable: boolean;
  status: "AVAILABLE" | "TAKEN" | "PREMIUM" | "PENDING" | "ERROR";
  registrar?: string;
  createdDate?: string;
  expiresDate?: string;
  nameservers?: string[];
  checkTimeMs: number;
  error?: string;
}

interface DohResponse {
  Status: number; // 0 = NOERROR, 2 = SERVFAIL (Delegated/Taken), 3 = NXDOMAIN (Available)
  Answer?: Array<{ name: string; type: number; TTL: number; data: string }>;
  Authority?: Array<{ name: string; type: number; TTL: number; data: string }>;
}

/**
 * Ultra-Fast & Precise DNS resolution via Cloudflare DoH & Google DoH (sub-50ms)
 */
async function queryDnsFast(domain: string): Promise<{ isAvailable: boolean; nameservers?: string[] }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const cfUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=NS`;
    const res = await fetch(cfUrl, {
      headers: { Accept: "application/dns-json" },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as DohResponse;

      // Status 3 (NXDOMAIN) = Definitive: Unregistered / Available!
      if (data.Status === 3) {
        return { isAvailable: true };
      }

      // Status 0 with active Answer records = Registered
      if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
        const nsList = data.Answer.filter((a) => a.type === 2).map((a) => a.data.replace(/\.$/, ""));
        return { isAvailable: false, nameservers: nsList };
      }

      // Status 2 (SERVFAIL with delegation) = Registered (parked / inactive DNS)
      if (data.Status === 2) {
        return { isAvailable: false };
      }
    }
  } catch {
    // Fallback to Google DNS
  }

  // Backup verification via Google DoH
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const googleUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=NS`;
    const res = await fetch(googleUrl, {
      headers: { Accept: "application/dns-json" },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as DohResponse;
      if (data.Status === 3) {
        return { isAvailable: true };
      }
      if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
        return { isAvailable: false };
      }
      if (data.Status === 2) {
        return { isAvailable: false };
      }
    }
  } catch {
    // Fallback
  }

  return { isAvailable: false };
}

/**
 * Fast authoritative domain availability check
 */
export async function checkDomainAvailability(fullDomain: string): Promise<DomainCheckResult> {
  const startTime = Date.now();
  const cleanDomain = fullDomain.trim().toLowerCase();
  
  const parts = cleanDomain.split(".");
  const tld = parts.length > 1 ? `.${parts.slice(1).join(".")}` : ".com";
  const name = parts[0];

  try {
    const result = await queryDnsFast(cleanDomain);

    if (result.isAvailable) {
      return {
        domain: cleanDomain,
        name,
        tld,
        isAvailable: true,
        status: "AVAILABLE",
        checkTimeMs: Date.now() - startTime,
      };
    }

    return {
      domain: cleanDomain,
      name,
      tld,
      isAvailable: false,
      status: "TAKEN",
      nameservers: result.nameservers,
      checkTimeMs: Date.now() - startTime,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Lookup failed";
    return {
      domain: cleanDomain,
      name,
      tld,
      isAvailable: false,
      status: "ERROR",
      error: errorMsg,
      checkTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Batch checker with concurrency
 */
export async function checkDomainsBatch(
  domains: string[],
  concurrency: number = 20
): Promise<DomainCheckResult[]> {
  const results: DomainCheckResult[] = [];
  const queue = [...domains];

  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const domain = queue.shift();
      if (!domain) break;
      const res = await checkDomainAvailability(domain);
      results.push(res);
    }
  });

  await Promise.all(workers);
  return results;
}
