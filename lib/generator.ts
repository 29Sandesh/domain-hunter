export interface GeneratedDomain {
  domain: string;
  name: string;
  tld: string;
  style: string;
  length: number;
  isAvailable?: boolean;
}

export interface GeneratorOptions {
  description?: string;
  preferredTlds?: string[];
}

// Concept Map: Expands situations & keywords into rich thematic vocabulary
const DOMAIN_CONCEPTS: Record<string, { roots: string[]; actions: string[]; suffixes: string[] }> = {
  // Sales & Leads
  lead: {
    roots: ["lead", "prospect", "pipeline", "funnel", "deal", "reach", "quota", "client", "buyer"],
    actions: ["scout", "find", "reach", "hunt", "close", "pitch", "convert", "scale", "track", "boost"],
    suffixes: ["flow", "hub", "lab", "hq", "kit", "box", "stack", "pulse", "craft", "base", "desk", "grid", "engine"]
  },
  sales: {
    roots: ["sales", "deal", "revenue", "close", "pitch", "win", "target", "quota", "pipe"],
    actions: ["close", "pitch", "convert", "scale", "boost", "drive", "hunt", "win"],
    suffixes: ["hq", "hub", "flow", "lab", "kit", "deck", "pulse", "craft", "engine"]
  },
  call: {
    roots: ["call", "dial", "talk", "voice", "line", "audio", "ring", "rep"],
    actions: ["listen", "assist", "coach", "guide", "record", "pitch", "prompt"],
    suffixes: ["ai", "hq", "lab", "flow", "box", "desk", "pulse", "core", "pilot"]
  },
  email: {
    roots: ["mail", "inbox", "drip", "post", "letter", "reach", "relay", "send"],
    actions: ["send", "verify", "warm", "reach", "deliver", "route", "track"],
    suffixes: ["box", "hq", "flow", "lab", "hub", "pulse", "kit", "stack", "relay"]
  },
  pos: {
    roots: ["dine", "table", "menu", "bill", "order", "food", "tab", "cafe", "bistro", "dish"],
    actions: ["serve", "pay", "order", "dine", "taste", "print", "count", "track"],
    suffixes: ["pos", "hq", "desk", "hub", "tap", "pass", "flow", "box", "kit"]
  },
  restaurant: {
    roots: ["dine", "menu", "table", "food", "chef", "plate", "eats", "bistro", "cafe", "grill"],
    actions: ["serve", "dine", "taste", "order", "cook", "book", "reserve"],
    suffixes: ["app", "hq", "hub", "flow", "box", "pass", "spot", "bar"]
  },
  ai: {
    roots: ["ai", "agent", "neural", "mind", "intel", "bot", "brain", "logic", "cortex", "spark"],
    actions: ["think", "prompt", "assist", "guide", "solve", "build", "craft", "model"],
    suffixes: ["ai", "os", "hq", "lab", "hub", "flow", "core", "grid", "matrix", "node"]
  },
  voice: {
    roots: ["voice", "sound", "audio", "vocal", "sonic", "tone", "listen", "echo", "mic"],
    actions: ["speak", "talk", "hear", "listen", "echo", "prompt", "stream"],
    suffixes: ["ai", "lab", "box", "hub", "flow", "cast", "wave", "pulse"]
  },
  erp: {
    roots: ["trade", "stock", "ledger", "asset", "tally", "vault", "item", "count", "flow", "tax"],
    actions: ["manage", "track", "audit", "tally", "trade", "invoice", "balance"],
    suffixes: ["erp", "one", "os", "hq", "hub", "stack", "core", "vault", "desk"]
  },
  crm: {
    roots: ["client", "deal", "contact", "realty", "agent", "broker", "buyer", "team"],
    actions: ["track", "connect", "reach", "manage", "sync", "close"],
    suffixes: ["crm", "hq", "hub", "flow", "desk", "base", "kit", "suite"]
  },
  code: {
    roots: ["code", "dev", "stack", "repo", "git", "byte", "syntax", "node", "script"],
    actions: ["ship", "build", "craft", "deploy", "compile", "run", "test"],
    suffixes: ["dev", "io", "lab", "kit", "hub", "box", "stack", "forge", "node"]
  },
  realty: {
    roots: ["estate", "realty", "home", "land", "plot", "nest", "haven", "loft", "villa", "vista"],
    actions: ["find", "list", "rent", "buy", "sell", "lease", "dwell"],
    suffixes: ["hq", "hub", "desk", "space", "point", "base", "nest", "haven"]
  }
};

const BRAND_PREFIXES = ["get", "go", "try", "use", "we", "nov", "pro", "zen", "omni", "sync", "swift", "prime", "bold", "pure", "true", "peak", "hyper", "meta"];
const BRAND_SUFFIXES = ["io", "os", "hq", "ai", "lab", "hub", "box", "app", "ly", "fy", "ora", "ix", "ra", "va", "on", "up", "flow", "pilot", "craft", "wave", "sync", "snap", "core", "base", "desk", "grid", "kit", "loop"];

function clean(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

// Smart Situation Parser
function parseUserSituation(text: string): { keywords: string[]; thematicRoots: string[]; thematicActions: string[]; thematicSuffixes: string[] } {
  const stopWords = new Set([
    "i", "am", "a", "an", "the", "and", "or", "for", "with", "to", "in", "of", "on", "at", "by", "from",
    "that", "this", "is", "are", "was", "were", "be", "being", "been", "have", "has", "had", "do", "does",
    "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "my", "your", "his",
    "her", "its", "our", "their", "want", "need", "like", "making", "building", "creating", "looking", "something",
    "tool", "app", "software", "system", "platform", "solution", "product", "service", "website", "project"
  ]);

  const rawTokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map(clean)
    .filter((w) => w.length >= 2 && !stopWords.has(w));

  const matchedRoots: string[] = [];
  const matchedActions: string[] = [];
  const matchedSuffixes: string[] = [];

  for (const token of rawTokens) {
    for (const [key, concept] of Object.entries(DOMAIN_CONCEPTS)) {
      if (token.includes(key) || key.includes(token)) {
        matchedRoots.push(...concept.roots);
        matchedActions.push(...concept.actions);
        matchedSuffixes.push(...concept.suffixes);
      }
    }
  }

  const primaryKeywords = Array.from(new Set(rawTokens));
  if (primaryKeywords.length === 0) primaryKeywords.push("flow", "stack", "cloud");

  return {
    keywords: primaryKeywords,
    thematicRoots: Array.from(new Set(matchedRoots)),
    thematicActions: Array.from(new Set(matchedActions)),
    thematicSuffixes: Array.from(new Set(matchedSuffixes)),
  };
}

export function generateDomainCandidates(options: GeneratorOptions): GeneratedDomain[] {
  const targetTlds = options.preferredTlds && options.preferredTlds.length > 0
    ? options.preferredTlds.map((t) => (t.startsWith(".") ? t.toLowerCase() : `.${t.toLowerCase()}`))
    : [".com"];

  const { keywords, thematicRoots, thematicActions, thematicSuffixes } = parseUserSituation(options.description || "saas");

  const primary = keywords[0];
  const roots = Array.from(new Set([primary, ...keywords.slice(1), ...thematicRoots])).slice(0, 10);
  const actions = thematicActions.length > 0 ? thematicActions : ["get", "go", "try", "use", "sync", "pro"];
  const suffixes = thematicSuffixes.length > 0 ? thematicSuffixes : BRAND_SUFFIXES;

  const candidates: GeneratedDomain[] = [];
  const seen = new Set<string>();

  function add(name: string, tld: string, style: string) {
    if (!targetTlds.includes(tld)) return;
    const cl = clean(name);
    // Strict Length Filter: ONLY 4 to 12 characters max!
    if (!cl || cl.length < 4 || cl.length > 12) return;
    const full = `${cl}${tld}`;
    if (seen.has(full)) return;
    seen.add(full);

    candidates.push({
      domain: full,
      name: cl,
      tld,
      style,
      length: cl.length,
    });
  }

  for (const tld of targetTlds) {
    // 1. Short Prefix + Core Word (5-9 chars)
    for (const pre of BRAND_PREFIXES) {
      for (const root of roots.slice(0, 4)) {
        add(`${pre}${root}`, tld, "Brandable Prefix");
      }
    }

    // 2. Core Word + Modern Suffix (5-9 chars)
    for (const sfx of suffixes) {
      for (const root of roots.slice(0, 5)) {
        add(`${root}${sfx}`, tld, "Modern Suffix");
      }
    }

    // 3. Action + Core Word (6-10 chars)
    for (const act of actions) {
      for (const root of roots.slice(0, 4)) {
        add(`${act}${root}`, tld, "Action Brand");
        add(`${root}${act}`, tld, "Action Brand");
      }
    }

    // 4. Coined Neologisms (5-8 chars)
    for (const root of roots.slice(0, 3)) {
      const shortRoot = root.length > 5 ? root.slice(0, 4) : root;
      add(`${shortRoot}a`, tld, "Coined Brand");
      add(`${shortRoot}o`, tld, "Coined Brand");
      add(`${shortRoot}ix`, tld, "Coined Brand");
      add(`${shortRoot}os`, tld, "Coined Brand");
      add(`${shortRoot}ra`, tld, "Coined Brand");
      add(`${shortRoot}on`, tld, "Coined Brand");
      add(`${shortRoot}fy`, tld, "Coined Brand");
      add(`${shortRoot}ly`, tld, "Coined Brand");
      add(`${shortRoot}via`, tld, "Coined Brand");
    }

    // 5. Clean 2-Word Compound (7-11 chars)
    for (let i = 0; i < Math.min(roots.length, 4); i++) {
      for (let j = i + 1; j < Math.min(roots.length, 6); j++) {
        add(`${roots[i]}${roots[j]}`, tld, "Compound");
        add(`${roots[j]}${roots[i]}`, tld, "Compound");
      }
    }
  }

  // Interleave and sort by shortest length first!
  return candidates.sort((a, b) => a.length - b.length);
}
