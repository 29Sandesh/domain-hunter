import { evaluateBrandMetrics, BrandMetrics } from "./brand-scoring";

export interface GeneratedDomainCandidate {
  domain: string;
  name: string;
  tld: string;
  style: "Short & Punchy" | "Tech & AI" | "Brandable / Abstract" | "Compound" | "Affix & Action" | "Exact Match";
  rationale: string;
  metrics: BrandMetrics;
}

export interface DomainGenOptions {
  description?: string;
  keywords?: string[];
  styles?: string[];
  preferredTlds?: string[];
  apiKey?: string;
  provider?: "gemini" | "openai" | "builtin";
}

const CATEGORY_THESAURUS: Record<string, string[]> = {
  lead: ["prospect", "pipeline", "reach", "outbound", "client", "acquire", "funnel", "deal", "harvest", "convert", "radar", "beacon", "scout", "magnet", "sprout", "signal", "apex", "orbit", "vortex", "bloom", "harbor", "surge", "crest", "prism", "loom", "horizon", "spark"],
  sales: ["deal", "revenue", "close", "pitch", "convert", "pipeline", "quota", "funnel", "scale", "boost", "target", "market", "trade", "profit", "summit", "peak"],
  email: ["inbox", "mail", "send", "letter", "reach", "dispatch", "post", "courier", "relay", "pulse", "deliver", "signal", "beacon", "route"],
  pos: ["table", "menu", "dine", "order", "bill", "kitchen", "cafe", "bistro", "chef", "food", "tab", "register", "counter", "serve", "receipt", "bite", "feast"],
  restaurant: ["dine", "menu", "table", "food", "dish", "eats", "bistro", "kitchen", "chef", "meal", "grill", "cafe", "flavor", "plate", "snack"],
  ai: ["neural", "agent", "mind", "intellect", "brain", "bot", "synapse", "nexus", "matrix", "cortex", "spark", "quantum", "omni", "logic", "tensor", "prompt", "model"],
  voice: ["speak", "sound", "vocal", "sonic", "talk", "tone", "echo", "listen", "pogo", "audio", "mic", "chatter", "dialog", "voicebox"],
  erp: ["ledger", "stock", "trade", "invoice", "vault", "balance", "audit", "tally", "inventory", "dispatch", "supply", "matrix", "count", "asset", "flow"],
  code: ["dev", "script", "stack", "forge", "repo", "git", "syntax", "compile", "ship", "deploy", "byte", "binary", "logic", "craft", "node"],
  scrape: ["crawler", "spider", "extract", "fetch", "harvest", "scout", "miner", "gather", "index", "radar", "sweep", "hunter"],
  seo: ["rank", "search", "traffic", "organic", "visibility", "keyword", "index", "ladder", "climb", "beacon", "crest", "peak"],
  realestate: ["realty", "estate", "home", "land", "plot", "nest", "haven", "dwell", "loft", "villa", "vista", "space", "brick", "roof"],
};

const METAPHOR_NOUNS = [
  "beacon", "sprout", "crest", "harbor", "orbit", "vortex", "bloom", "prism", "loom", "horizon",
  "hive", "vault", "forge", "spring", "zenith", "vector", "bridge", "nexus", "pulse",
  "craft", "wave", "matrix", "grid", "signal", "core", "catalyst", "loop", "nest", "spark", "bay"
];

const ACTION_VERBS = [
  "scout", "harvest", "acquire", "spark", "hunt", "catch", "boost", "gather", "pitch", "target",
  "trace", "build", "launch", "reach", "drive", "expand", "scale", "craft", "elevate", "stream", "track"
];

const POWER_MODIFIERS = [
  "swift", "true", "prime", "pure", "bold", "apex", "peak", "vivid", "sharp", "clean", "hyper", "super", "next", "pro", "rapid", "bright"
];

const AFFIX_PREFIXES = [
  "get", "use", "try", "go", "my", "the"
];

const TECH_HUBS = [
  "hq", "lab", "hub", "desk", "base", "box", "zone", "suite", "station", "yard", "flow",
  "pulse", "craft", "stack", "wave", "forge", "scale", "matrix", "loop", "room", "deck"
];

const SUFFIX_WORDS = [
  "ify", "ly", "ora", "ix", "able", "ist", "ic", "wise", "verse", "way"
];

function cleanWord(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

function getSingularAndPlural(word: string): { singular: string; plural: string } {
  const clean = cleanWord(word);
  if (clean.endsWith("s") && clean.length > 3) {
    return { singular: clean.slice(0, -1), plural: clean };
  }
  return { singular: clean, plural: `${clean}s` };
}

export function generateDomainIdeasAlgorithmic(options: DomainGenOptions): GeneratedDomainCandidate[] {
  const targetTlds = options.preferredTlds && options.preferredTlds.length > 0
    ? options.preferredTlds.map((t) => (t.startsWith(".") ? t.toLowerCase() : `.${t.toLowerCase()}`))
    : [".com"];

  const rawDescTokens = (options.description || "saas tool")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !["and", "the", "for", "with", "this", "that", "from", "your", "what", "tool", "need", "generaton", "generation", "building", "looking"].includes(w));

  const explicitKeywords = (options.keywords || []).map(cleanWord).filter((w) => w.length >= 2);
  const combinedTokens = Array.from(new Set([...explicitKeywords, ...rawDescTokens]));

  const baseRoots: string[] = [];
  for (const token of combinedTokens) {
    const { singular, plural } = getSingularAndPlural(token);
    baseRoots.push(singular);
    baseRoots.push(plural);
  }

  const semanticExpansions: string[] = [];
  for (const root of baseRoots) {
    for (const [catKey, syns] of Object.entries(CATEGORY_THESAURUS)) {
      if (root.includes(catKey) || catKey.includes(root)) {
        semanticExpansions.push(...syns);
      }
    }
  }

  const primaryWord = baseRoots[0] || "lead";
  const primaryPlural = baseRoots[1] || `${primaryWord}s`;
  const expandedRoots = Array.from(new Set([...baseRoots, ...semanticExpansions])).slice(0, 18);

  const candidates: GeneratedDomainCandidate[] = [];
  const seenDomains = new Set<string>();

  function addCandidate(name: string, tld: string, style: GeneratedDomainCandidate["style"], rationale: string) {
    if (!targetTlds.includes(tld)) return;

    const cleanName = cleanWord(name);
    if (!cleanName || cleanName.length < 4 || cleanName.length > 22 || cleanName.endsWith("sss")) return;
    const full = `${cleanName}${tld}`;
    if (seenDomains.has(full)) return;
    seenDomains.add(full);

    const metrics = evaluateBrandMetrics(cleanName, tld);
    candidates.push({
      domain: full,
      name: cleanName,
      tld,
      style,
      rationale,
      metrics,
    });
  }

  for (const tld of targetTlds) {
    // 1. High-Availability Compound Formats (Verb + Noun + Modifier or Noun + Metaphor + Pro)
    for (const verb of ACTION_VERBS) {
      addCandidate(`${verb}${primaryPlural}`, tld, "Compound", `Action verb with plural noun`);
      addCandidate(`${verb}${primaryWord}`, tld, "Compound", `Action verb with root`);
      addCandidate(`${verb}${primaryWord}flow`, tld, "Compound", `Action verb with workflow`);
      addCandidate(`${verb}${primaryWord}pro`, tld, "Compound", `Pro-tier action brand`);
      addCandidate(`${verb}${primaryWord}hub`, tld, "Compound", `Action hub domain`);
      for (const exp of expandedRoots.slice(0, 4)) {
        addCandidate(`${verb}${exp}pro`, tld, "Compound", `Action verb with concept pro`);
      }
    }

    // 2. Metaphorical Pairings
    for (const meta of METAPHOR_NOUNS) {
      addCandidate(`${primaryWord}${meta}`, tld, "Compound", `Evocative brand pairing ${primaryWord} with ${meta}`);
      addCandidate(`${meta}${primaryWord}`, tld, "Compound", `Evocative brand pairing ${meta} with ${primaryWord}`);
      addCandidate(`${primaryWord}${meta}s`, tld, "Compound", `Plural compound brand`);
      addCandidate(`${primaryWord}${meta}hq`, tld, "Tech & AI", `Authority compound brand`);
      addCandidate(`${primaryWord}${meta}lab`, tld, "Tech & AI", `Innovation lab compound brand`);
    }

    // 3. Power Modifiers & Prefixes
    for (const modifier of POWER_MODIFIERS) {
      addCandidate(`${modifier}${primaryPlural}`, tld, "Affix & Action", `Punchy power modifier`);
      addCandidate(`${modifier}${primaryWord}flow`, tld, "Affix & Action", `Power modifier with flow`);
      addCandidate(`${modifier}${primaryWord}hq`, tld, "Affix & Action", `Authority presence`);
      addCandidate(`${modifier}${primaryWord}hub`, tld, "Affix & Action", `Power hub presence`);
      addCandidate(`${modifier}${primaryWord}lab`, tld, "Affix & Action", `Power lab presence`);
    }

    // 4. Action Prefixes (e.g. GetLeadFlow, TryLeadGen, GoProspects)
    for (const prefix of AFFIX_PREFIXES) {
      addCandidate(`${prefix}${primaryPlural}`, tld, "Affix & Action", `Action call-to-action`);
      addCandidate(`${prefix}${primaryWord}flow`, tld, "Affix & Action", `Action workflow call-to-action`);
      addCandidate(`${prefix}${primaryWord}pro`, tld, "Affix & Action", `Action pro tier`);
      addCandidate(`${prefix}${primaryWord}stack`, tld, "Affix & Action", `Full-stack action call-to-action`);
      addCandidate(`${prefix}${primaryWord}now`, tld, "Affix & Action", `Immediate call-to-action`);
    }

    // 5. Tech Hub Authorities (e.g. LeadHQ, LeadLab, LeadDesk, LeadStation)
    for (const hub of TECH_HUBS) {
      addCandidate(`${primaryWord}${hub}`, tld, "Tech & AI", `Modern authority tech extension`);
      addCandidate(`${primaryPlural}${hub}`, tld, "Tech & AI", `Plural category tech hub`);
      addCandidate(`${primaryWord}pro${hub}`, tld, "Tech & AI", `Pro authority tech extension`);
    }

    // 6. Smooth Brandable Suffixes & Neologisms
    for (const suffix of SUFFIX_WORDS) {
      addCandidate(`${primaryWord}${suffix}`, tld, "Brandable / Abstract", `Clean coined brandable`);
      addCandidate(`${primaryWord}${suffix}pro`, tld, "Brandable / Abstract", `Coined pro brandable`);
      for (const exp of expandedRoots.slice(0, 5)) {
        addCandidate(`${exp}${suffix}`, tld, "Brandable / Abstract", `Derived coined brandable`);
      }
    }
  }

  return candidates.sort((a, b) => b.metrics.score - a.metrics.score);
}

export async function generateDomainIdeasAI(options: DomainGenOptions): Promise<GeneratedDomainCandidate[]> {
  const targetTlds = options.preferredTlds && options.preferredTlds.length > 0
    ? options.preferredTlds.map((t) => (t.startsWith(".") ? t.toLowerCase() : `.${t.toLowerCase()}`))
    : [".com"];

  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return generateDomainIdeasAlgorithmic(options);
  }

  try {
    const prompt = `You are a world-class domain naming strategist.
Generate 40 highly creative domain names related to "${options.description || options.keywords?.join(", ")}".
STRICT TLDs: ${targetTlds.join(", ")}

Respond ONLY with a JSON array:
[
  {
    "name": "brandroot",
    "tld": "${targetTlds[0]}",
    "style": "Compound",
    "rationale": "Why this is a great domain"
  }
]`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, maxOutputTokens: 2048 },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as Array<{ name: string; tld: string; style: string; rationale: string }>;
        const aiCandidates: GeneratedDomainCandidate[] = [];

        for (const item of parsed) {
          const cleanName = cleanWord(item.name);
          const tld = item.tld.startsWith(".") ? item.tld.toLowerCase() : `.${item.tld.toLowerCase()}`;
          if (!targetTlds.includes(tld)) continue;

          const full = `${cleanName}${tld}`;
          const metrics = evaluateBrandMetrics(cleanName, tld);
          aiCandidates.push({
            domain: full,
            name: cleanName,
            tld,
            style: (item.style as GeneratedDomainCandidate["style"]) || "Compound",
            rationale: item.rationale || "AI generated creative brand",
            metrics,
          });
        }

        const algoCandidates = generateDomainIdeasAlgorithmic(options);
        const combined = [...aiCandidates, ...algoCandidates];
        const unique = new Map<string, GeneratedDomainCandidate>();
        for (const c of combined) {
          if (targetTlds.includes(c.tld) && !unique.has(c.domain)) {
            unique.set(c.domain, c);
          }
        }
        return Array.from(unique.values()).sort((a, b) => b.metrics.score - a.metrics.score);
      }
    }
  } catch {
    // Fallback
  }

  return generateDomainIdeasAlgorithmic(options);
}
