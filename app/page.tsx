"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  Zap,
  Tag,
  ShieldCheck,
  Github,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { DomainSearchInput } from "@/components/DomainSearchInput";
import { DomainCard, DomainItem } from "@/components/DomainCard";
import { ShortlistDrawer } from "@/components/ShortlistDrawer";

const QUICK_SEARCHES = [
  "ai voice",
  "b2b leads",
  "cloud pos",
  "cold email",
  "food menu",
  "code repo",
];

export default function DomenApp() {
  const [domainItems, setDomainItems] = useState<DomainItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  // Shortlist state
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [shortlist, setShortlist] = useState<DomainItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedShortlist = localStorage.getItem("domen_shortlist");
      if (savedShortlist) setShortlist(JSON.parse(savedShortlist));

      const savedNotes = localStorage.getItem("domen_notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch {
      // Ignore
    }
  }, []);

  // Save shortlist changes
  useEffect(() => {
    try {
      localStorage.setItem("domen_shortlist", JSON.stringify(shortlist));
    } catch {
      // Ignore
    }
  }, [shortlist]);

  // Save notes changes
  useEffect(() => {
    try {
      localStorage.setItem("domen_notes", JSON.stringify(notes));
    } catch {
      // Ignore
    }
  }, [notes]);

  const handleToggleShortlist = (item: DomainItem) => {
    const exists = shortlist.some((s) => s.domain === item.domain);
    if (exists) {
      setShortlist(shortlist.filter((s) => s.domain !== item.domain));
    } else {
      setShortlist([...shortlist, item]);
      confetti({
        particleCount: 20,
        spread: 35,
        origin: { y: 0.8 },
      });
    }
  };

  const handleSearch = async (params: {
    description: string;
    preferredTlds: string[];
  }) => {
    setIsLoading(true);
    setHasSearched(true);
    setLastQuery(params.description);

    try {
      const res = await fetch("/api/domains/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        const domains = (data.domains || []) as DomainItem[];
        const availableOnly = domains.filter((d) => d.isAvailable);
        setDomainItems(availableOnly);

        if (availableOnly.length > 0) {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.6 },
          });
        }
      }
    } catch {
      // Search failed
    } finally {
      setIsLoading(false);
    }
  };

  const availableItems = useMemo(() => {
    return domainItems.filter((item) => item.isAvailable);
  }, [domainItems]);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 bg-mesh-pattern">
      {/* Soft Ambient Radial Light */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-blue-400/5 blur-[120px]" />
      </div>

      {/* Top Header */}
      <Header
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setIsShortlistOpen(true)}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* ================= LEFT COLUMN: SLEEK MINIMAL BRANDING ================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-7">
            
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Sub-50ms DNS-over-HTTPS Verification</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.12]">
                Find the perfect <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">domain</span> for your next venture.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Enter your startup keywords. Domen scans hundreds of high-recall naming combinations and checks live registry availability in milliseconds.
              </p>
            </div>

            {/* Clean Value Propositions */}
            <div className="space-y-4 pt-1 border-t border-slate-200/60">
              <div className="flex items-start gap-3 text-xs">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100/80 text-blue-700 mt-0.5">
                  <Zap className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">Zero False Positives:</span>
                  <span className="text-slate-500 ml-1">Direct Cloudflare DNS queries guarantee 100% verified available names.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100/80 text-emerald-700 mt-0.5">
                  <Tag className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">Registrar Price Comparison:</span>
                  <span className="text-slate-500 ml-1">Compare Porkbun, Dynadot, Namecheap & GoDaddy in 1 click.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100/80 text-indigo-700 mt-0.5">
                  <ShieldCheck className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">100% Private & Open Source:</span>
                  <span className="text-slate-500 ml-1">Zero domain sniping, no API keys, and no rate limits.</span>
                </div>
              </div>
            </div>

            {/* GitHub Open Source Banner */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 flex items-center justify-between shadow-2xs transition-all hover:border-slate-300">
              <div className="flex items-center gap-2.5">
                <Github className="h-4 w-4 text-slate-800" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Open Source on GitHub</div>
                  <div className="text-[11px] text-slate-400">1-command install available</div>
                </div>
              </div>
              <a
                href="https://github.com/29Sandesh/domain-hunter"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <span>Star Repo</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE DISCOVERY & LIVE STREAM ================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Search Engine Container */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Domain Discovery Engine
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Live Cloudflare DNS
                </span>
              </div>

              <DomainSearchInput onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Live Results Stream */}
            {hasSearched ? (
              <div className="space-y-3">
                {/* Results Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Available to Buy
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.2 text-[11px] font-bold text-blue-800">
                      {availableItems.length}
                    </span>
                  </div>
                  {lastQuery && (
                    <span className="text-xs text-slate-400 truncate max-w-[200px]">
                      for &ldquo;{lastQuery}&rdquo;
                    </span>
                  )}
                </div>

                {/* Domain Cards List */}
                {availableItems.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-2xs space-y-2">
                    <p className="text-sm font-semibold text-slate-800">No available domains found for this keyword.</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try searching another keyword or selecting additional extensions (like .ai, .io, .co).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {availableItems.map((item) => (
                      <DomainCard
                        key={item.domain}
                        item={item}
                        isShortlisted={shortlist.some((s) => s.domain === item.domain)}
                        onToggleShortlist={handleToggleShortlist}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Elevated Pre-Search State with 1-Click Try Pills */
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-slate-800">Ready to find your domain</h2>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Type any keyword or click a trending idea below to test live availability:
                  </p>
                </div>

                {/* Quick 1-Click Try Buttons */}
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  {QUICK_SEARCHES.map((query) => (
                    <button
                      key={query}
                      onClick={() => handleSearch({ description: query, preferredTlds: [".com"] })}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 active:scale-95"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Slide-out Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        shortlist={shortlist}
        onRemoveItem={(domain) => setShortlist(shortlist.filter((s) => s.domain !== domain))}
        onClearAll={() => setShortlist([])}
        onUpdateNote={(domain, note) => setNotes({ ...notes, [domain]: note })}
        notes={notes}
      />
    </div>
  );
}
