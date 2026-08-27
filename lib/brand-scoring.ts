export interface BrandMetrics {
  score: number; // 0 - 100
  brandability: "Exceptional" | "Great" | "Good" | "Moderate";
  radioTest: "Pass" | "Moderate" | "Difficult";
  pronounceabilityScore: number;
  lengthGrade: "Ultra Short" | "Punchy" | "Balanced" | "Long";
  syllables: number;
  tags: string[];
}

// Approximate English syllable count
function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (clean.length <= 3) return 1;
  const matches = clean.match(/[aeiouy]{1,2}/g);
  if (!matches) return 1;
  let count = matches.length;
  if (clean.endsWith("e") && !clean.endsWith("le") && count > 1) {
    count--;
  }
  return Math.max(1, count);
}

export function evaluateBrandMetrics(nameWithoutTld: string, tld: string = ".com"): BrandMetrics {
  const root = nameWithoutTld.toLowerCase().replace(/[^a-z0-9]/g, "");
  const len = root.length;
  const syllables = countSyllables(root);

  let score = 70;
  const tags: string[] = [];

  // Length scoring
  let lengthGrade: BrandMetrics["lengthGrade"] = "Balanced";
  if (len <= 4) {
    score += 25;
    lengthGrade = "Ultra Short";
    tags.push("Ultra-Rare Length", "High Valuation");
  } else if (len <= 7) {
    score += 18;
    lengthGrade = "Punchy";
    tags.push("High Recall", "Punchy");
  } else if (len <= 11) {
    score += 8;
    lengthGrade = "Balanced";
    tags.push("Standard Length");
  } else {
    score -= 15;
    lengthGrade = "Long";
  }

  // Vowel to consonant ratio analysis
  const vowels = (root.match(/[aeiou]/g) || []).length;
  const consonants = len - vowels;
  const vowelRatio = vowels / Math.max(1, len);

  let pronounceabilityScore = 80;
  if (vowelRatio >= 0.3 && vowelRatio <= 0.55) {
    pronounceabilityScore += 15;
    score += 8;
  } else if (vowelRatio < 0.2 || vowelRatio > 0.7) {
    pronounceabilityScore -= 25;
    score -= 12;
  }

  // Check for repeated awkward consonants (e.g., 'bkq', 'xzq')
  if (/[bcdfghjklmnpqrstvwxyz]{4,}/.test(root)) {
    pronounceabilityScore -= 20;
    score -= 10;
  }

  // TLD bonus
  if (tld === ".com") {
    score += 8;
    tags.push("Global Authority");
  } else if (tld === ".ai" || tld === ".io") {
    score += 6;
    tags.push("Tech Modern");
  } else if (tld === ".app" || tld === ".dev") {
    score += 4;
    tags.push("Developer Ready");
  }

  // Clamp scores
  score = Math.min(99, Math.max(35, Math.round(score)));
  pronounceabilityScore = Math.min(100, Math.max(30, Math.round(pronounceabilityScore)));

  // Radio test rating
  let radioTest: BrandMetrics["radioTest"] = "Pass";
  if (pronounceabilityScore >= 80 && len <= 9) {
    radioTest = "Pass";
    tags.push("Passes Radio Test");
  } else if (pronounceabilityScore >= 60) {
    radioTest = "Moderate";
  } else {
    radioTest = "Difficult";
  }

  // Overall brandability category
  let brandability: BrandMetrics["brandability"] = "Good";
  if (score >= 88) brandability = "Exceptional";
  else if (score >= 78) brandability = "Great";
  else if (score >= 65) brandability = "Good";
  else brandability = "Moderate";

  return {
    score,
    brandability,
    radioTest,
    pronounceabilityScore,
    lengthGrade,
    syllables,
    tags: Array.from(new Set(tags)).slice(0, 3),
  };
}
