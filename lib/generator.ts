export interface GeneratedDomain {
  domain: string;
  name: string;
  tld: string;
  style: string;
  isAvailable?: boolean;
}

export interface GeneratorOptions {
  description?: string;
  preferredTlds?: string[];
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

const AFFIX_PREFIXES = ["get", "use", "try", "go", "my", "the"];
const TECH_HUBS = ["hq", "lab", "hub", "desk", "base", "box", "zone", "suite", "station", "yard", "flow", "stack", "forge", "matrix", "loop"];
const SUFFIX_WORDS = ["ify", "ly", "ora", "ix", "able", "ist", "ic", "wise", "verse", "way"];

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

export function generateDomainCandidates(options: GeneratorOptions): GeneratedDomain[] {
  const targetTlds = options.preferredTlds && options.preferredTlds.length > 0
    ? options.preferredTlds.map((t) => (t.startsWith(".") ? t.toLowerCase() : `.${t.toLowerCase()}`))
    : [".com"];

  const rawTokens = (options.description || "saas")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !["and", "the", "for", "with", "this", "that", "from", "your", "what", "tool", "need", "generaton", "generation", "building", "looking"].includes(w));

  const baseRoots: string[] = [];
  for (const token of rawTokens) {
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

  const primaryWord = baseRoots[0] || "reach";
  const primaryPlural = baseRoots[1] || `${primaryWord}s`;
  const expandedRoots = Array.from(new Set([...baseRoots, ...semanticExpansions])).slice(0, 18);

  const candidates: GeneratedDomain[] = [];
  const seen = new Set<string>();

  function add(name: string, tld: string, style: string) {
    if (!targetTlds.includes(tld)) return;
    const clean = cleanWord(name);
    if (!clean || clean.length < 4 || clean.length > 22 || clean.endsWith("sss")) return;
    const full = `${clean}${tld}`;
    if (seen.has(full)) return;
    seen.add(full);

    candidates.push({
      domain: full,
      name: clean,
      tld,
      style,
    });
  }

  for (const tld of targetTlds) {
    // 1. Actions & Verbs
    for (const verb of ACTION_VERBS) {
      add(`${verb}${primaryPlural}`, tld, "Compound");
      add(`${verb}${primaryWord}`, tld, "Compound");
      add(`${verb}${primaryWord}flow`, tld, "Compound");
      add(`${verb}${primaryWord}pro`, tld, "Compound");
      add(`${verb}${primaryWord}hub`, tld, "Compound");
      for (const exp of expandedRoots.slice(0, 4)) {
        add(`${verb}${exp}pro`, tld, "Compound");
      }
    }

    // 2. Metaphors
    for (const meta of METAPHOR_NOUNS) {
      add(`${primaryWord}${meta}`, tld, "Compound");
      add(`${meta}${primaryWord}`, tld, "Compound");
      add(`${primaryWord}${meta}s`, tld, "Compound");
      add(`${primaryWord}${meta}hq`, tld, "Tech & AI");
      add(`${primaryWord}${meta}lab`, tld, "Tech & AI");
    }

    // 3. Power Modifiers
    for (const mod of POWER_MODIFIERS) {
      add(`${mod}${primaryPlural}`, tld, "Affix & Action");
      add(`${mod}${primaryWord}flow`, tld, "Affix & Action");
      add(`${mod}${primaryWord}hq`, tld, "Affix & Action");
      add(`${mod}${primaryWord}hub`, tld, "Affix & Action");
    }

    // 4. Prefixes
    for (const pre of AFFIX_PREFIXES) {
      add(`${pre}${primaryPlural}`, tld, "Affix & Action");
      add(`${pre}${primaryWord}flow`, tld, "Affix & Action");
      add(`${pre}${primaryWord}pro`, tld, "Affix & Action");
    }

    // 5. Tech Hubs
    for (const hub of TECH_HUBS) {
      add(`${primaryWord}${hub}`, tld, "Tech & AI");
      add(`${primaryPlural}${hub}`, tld, "Tech & AI");
    }

    // 6. Suffixes
    for (const sfx of SUFFIX_WORDS) {
      add(`${primaryWord}${sfx}`, tld, "Brandable");
      add(`${primaryWord}${sfx}pro`, tld, "Brandable");
      for (const exp of expandedRoots.slice(0, 5)) {
        add(`${exp}${sfx}`, tld, "Brandable");
      }
    }
  }

  return candidates;
}
