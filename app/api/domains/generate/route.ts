import { NextRequest, NextResponse } from "next/server";
import { generateDomainCandidates, GeneratorOptions } from "@/lib/generator";
import { checkDomainAvailability } from "@/lib/checker";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GeneratorOptions;
    const candidates = generateDomainCandidates(body);

    if (candidates.length === 0) {
      return NextResponse.json({ success: true, domains: [] });
    }

    // Check top 100 candidates in parallel with sub-50ms DNS resolution
    const pool = candidates.slice(0, 100);
    const results = await Promise.all(
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

    const available = results.filter((d) => d.isAvailable);

    return NextResponse.json({
      success: true,
      totalScanned: pool.length,
      availableCount: available.length,
      domains: available,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lookup failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
