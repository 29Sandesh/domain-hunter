import { NextRequest, NextResponse } from "next/server";
import { checkDomainsBatch } from "@/lib/dns-rdap-checker";
import { evaluateBrandMetrics } from "@/lib/brand-scoring";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const domains: string[] = body.domains;

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json({ error: "Please provide a non-empty array of domains" }, { status: 400 });
    }

    // Limit to 50 domains per request
    const cleanList = domains
      .map((d) => d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, ""))
      .filter((d) => d.includes(".") && d.length >= 3)
      .slice(0, 50);

    const checkResults = await checkDomainsBatch(cleanList, 10);

    const enriched = checkResults.map((res) => {
      const metrics = evaluateBrandMetrics(res.name, res.tld);
      return {
        ...res,
        metrics,
      };
    });

    const availableCount = enriched.filter((d) => d.isAvailable).length;
    const takenCount = enriched.filter((d) => !d.isAvailable).length;

    return NextResponse.json({
      success: true,
      total: enriched.length,
      availableCount,
      takenCount,
      results: enriched,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bulk check failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
