import { NextRequest, NextResponse } from "next/server";
import { generateDomainIdeasAI, DomainGenOptions } from "@/lib/domain-generator";
import { checkDomainAvailability } from "@/lib/dns-rdap-checker";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DomainGenOptions;

    // 1. Generate candidates with strict TLD filtering
    const candidates = await generateDomainIdeasAI(body);

    if (candidates.length === 0) {
      return NextResponse.json({
        success: true,
        totalGenerated: 0,
        availableCount: 0,
        domains: [],
      });
    }

    // 2. Select top 120 diverse candidates
    const pool = candidates.slice(0, 120);

    // 3. Fast sub-second parallel DNS verification across the whole pool
    const checkResults = await Promise.all(
      pool.map(async (cand) => {
        const res = await checkDomainAvailability(cand.domain);
        return {
          ...cand,
          isAvailable: res.isAvailable,
          status: res.status,
          nameservers: res.nameservers,
          checkTimeMs: res.checkTimeMs,
        };
      })
    );

    const availableDomains = checkResults.filter((d) => d.isAvailable);
    const takenDomains = checkResults.filter((d) => !d.isAvailable);

    // 4. Sort available domains by brandability score descending
    availableDomains.sort((a, b) => b.metrics.score - a.metrics.score);
    takenDomains.sort((a, b) => b.metrics.score - a.metrics.score);

    const finalDomains = [...availableDomains, ...takenDomains.slice(0, 10)];

    return NextResponse.json({
      success: true,
      totalGenerated: candidates.length,
      totalScanned: pool.length,
      availableCount: availableDomains.length,
      takenCount: takenDomains.length,
      domains: finalDomains,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate domain ideas";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
