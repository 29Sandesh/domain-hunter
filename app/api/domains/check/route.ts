import { NextRequest, NextResponse } from "next/server";
import { checkDomainAvailability, getRegistrarPricing } from "@/lib/checker";

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Missing domain query parameter" }, { status: 400 });
  }

  try {
    const result = await checkDomainAvailability(domain);
    const pricing = getRegistrarPricing(domain);
    return NextResponse.json({ ...result, pricing });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lookup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
