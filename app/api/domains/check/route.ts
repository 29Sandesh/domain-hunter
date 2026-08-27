import { NextRequest, NextResponse } from "next/server";
import { checkDomainAvailability } from "@/lib/dns-rdap-checker";
import { evaluateBrandMetrics } from "@/lib/brand-scoring";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain || typeof domain !== "string") {
    return NextResponse.json({ error: "domain parameter is required" }, { status: 400 });
  }

  const result = await checkDomainAvailability(domain);
  const metrics = evaluateBrandMetrics(result.name, result.tld);

  return NextResponse.json({
    ...result,
    metrics,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const domain = body.domain;

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "domain parameter is required" }, { status: 400 });
    }

    const result = await checkDomainAvailability(domain);
    const metrics = evaluateBrandMetrics(result.name, result.tld);

    return NextResponse.json({
      ...result,
      metrics,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
