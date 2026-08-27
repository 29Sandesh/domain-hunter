import { NextRequest, NextResponse } from "next/server";
import { checkDomainAvailability } from "@/lib/dns-rdap-checker";

interface DnsRecord {
  name: string;
  type: string;
  data: string;
  TTL: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "domain parameter is required" }, { status: 400 });
  }

  const cleanDomain = domain.trim().toLowerCase();
  const basic = await checkDomainAvailability(cleanDomain);

  // Fetch full DNS records across types: A, AAAA, MX, TXT, NS
  const recordTypes = ["A", "AAAA", "MX", "TXT", "NS"];
  const records: Record<string, string[]> = {};

  await Promise.all(
    recordTypes.map(async (type) => {
      try {
        const res = await fetch(
          `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanDomain)}&type=${type}`,
          { headers: { Accept: "application/dns-json" }, cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.Answer && Array.isArray(data.Answer)) {
            records[type] = data.Answer.map((a: DnsRecord) => a.data);
          }
        }
      } catch {
        // Skip
      }
    })
  );

  return NextResponse.json({
    domain: cleanDomain,
    availability: basic.isAvailable,
    status: basic.status,
    registrar: basic.registrar || "Not Available / Privacy Protected",
    createdDate: basic.createdDate || "Unknown",
    expiresDate: basic.expiresDate || "Unknown",
    nameservers: basic.nameservers || records["NS"] || [],
    dnsRecords: records,
    checkTimeMs: basic.checkTimeMs,
  });
}
