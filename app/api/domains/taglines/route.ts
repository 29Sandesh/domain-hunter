import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { domain, brandName, category } = await req.json();

    const name = brandName || domain.split(".")[0];
    const cat = category || "technology";

    // AI or intelligent procedural generator for instant response
    const taglines = [
      `The Intelligent Engine for Modern ${cat.charAt(0).toUpperCase() + cat.slice(1)}.`,
      `Empowering Next-Generation Builders to Scale Faster.`,
      `Simplify, Automate, and Dominate Your Market with ${name.charAt(0).toUpperCase() + name.slice(1)}.`,
    ];

    const elevatorPitch = `${name.charAt(0).toUpperCase() + name.slice(1)} is designed to streamline ${cat} workflows with precision, speed, and modern intelligent automation.`;

    const suggestedColor = name.length % 2 === 0 ? "#6366F1" : "#06B6D4";

    return NextResponse.json({
      domain,
      brandName: name,
      taglines,
      elevatorPitch,
      brandPalette: {
        primary: suggestedColor,
        secondary: "#10B981",
        accent: "#F59E0B",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate taglines" }, { status: 500 });
  }
}
