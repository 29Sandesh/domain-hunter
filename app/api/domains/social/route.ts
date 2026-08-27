import { NextRequest, NextResponse } from "next/server";

export interface SocialPlatformStatus {
  platform: string;
  handle: string;
  url: string;
  isAvailable: boolean | null; // null if undetermined
  checked: boolean;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");

  if (!handle) {
    return NextResponse.json({ error: "handle parameter is required" }, { status: 400 });
  }

  const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_]/g, "");

  const platforms: SocialPlatformStatus[] = [
    {
      platform: "GitHub",
      handle: cleanHandle,
      url: `https://github.com/${cleanHandle}`,
      isAvailable: null,
      checked: false,
    },
    {
      platform: "X (Twitter)",
      handle: cleanHandle,
      url: `https://x.com/${cleanHandle}`,
      isAvailable: null,
      checked: false,
    },
    {
      platform: "Reddit",
      handle: `u/${cleanHandle}`,
      url: `https://www.reddit.com/user/${cleanHandle}`,
      isAvailable: null,
      checked: false,
    },
    {
      platform: "YouTube",
      handle: `@${cleanHandle}`,
      url: `https://www.youtube.com/@${cleanHandle}`,
      isAvailable: null,
      checked: false,
    },
    {
      platform: "Instagram",
      handle: cleanHandle,
      url: `https://www.instagram.com/${cleanHandle}`,
      isAvailable: null,
      checked: false,
    },
  ];

  // Parallel checks for GitHub and Reddit APIs
  await Promise.all([
    (async () => {
      try {
        const ghRes = await fetch(`https://api.github.com/users/${cleanHandle}`, {
          headers: { "User-Agent": "DomainHunter-AI-Scanner" },
        });
        const gh = platforms.find((p) => p.platform === "GitHub");
        if (gh) {
          gh.checked = true;
          gh.isAvailable = ghRes.status === 404;
        }
      } catch {
        // Skip
      }
    })(),
    (async () => {
      try {
        const redditRes = await fetch(`https://www.reddit.com/user/${cleanHandle}/about.json`, {
          headers: { "User-Agent": "Mozilla/5.0 DomainHunter/1.0" },
        });
        const red = platforms.find((p) => p.platform === "Reddit");
        if (red) {
          red.checked = true;
          red.isAvailable = redditRes.status === 404;
        }
      } catch {
        // Skip
      }
    })(),
  ]);

  return NextResponse.json({
    handle: cleanHandle,
    platforms,
  });
}
