"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  Globe,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Github,
  Bookmark,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import { DomainSearchInput } from "@/components/DomainSearchInput";
import { DomainCard, DomainItem } from "@/components/DomainCard";
import { ShortlistDrawer } from "@/components/ShortlistDrawer";

export default function DomainHunterApp() {
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
      const savedShortlist = localStorage.getItem("domainhunter_shortlist");
      if (savedShortlist) setShortlist(JSON.parse(savedShortlist));

      const savedNotes = localStorage.getItem("domainhunter_notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch {
      // Ignore
    }
  }, []);

  // Save shortlist changes
  useEffect(() => {
    try {
      localStorage.setItem("domainhunter_shortlist", JSON.stringify(shortlist));
    } catch {
      // Ignore
    }
  }, [shortlist]);

  // Save notes changes
  useEffect(() => {
    try {
      localStorage.setItem("domainhunter_notes", JSON.stringify(notes));
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
    keywords: string[];
    styles: string[];
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
        // Filter strictly to AVAILABLE domains only
        const availableOnly = domains.filter((d) => d.isAvailable);
        setDomainItems(availableOnly);

        if (availableOnly.length > 0) {
          confetti({
            particleCount: 35,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setIsShortlistOpen(true)}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: COOL BRANDING & FEATURES ================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
            
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
              </span>
              <span>Real-Time DNS & Registry Intelligence</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.15]">
                Find the perfect <span className="text-blue-600">domain</span> for your next venture.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Describe your idea or brand keywords. Domen scans 100+ high-recall name combinations and checks live registrar availability in sub-seconds.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">Zero False Positives</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Direct Cloudflare & Google DNS zone queries guarantee 100% verified availability.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">Live Registrar Price Comparison</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Compare exact pricing on Porkbun, Namecheap, GoDaddy, Dynadot & Hostinger in 1 click.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">100% Free & Open Source</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    No subscriptions, no rate-limits, and no hidden affiliate markups.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick GitHub / Open Source Footer Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-slate-700" />
                <span className="text-xs font-semibold text-slate-800">Open Source on GitHub</span>
              </div>
              <a
                href="https://github.com/29Sandesh/domain-hunter"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                <span>Star Repo</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE SEARCH & LIVE RESULTS ================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Search Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Domain Discovery Engine
                </span>
                <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Sub-50ms DNS checks
                </span>
              </div>

              <DomainSearchInput onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Results Stream */}
            {hasSearched ? (
              <div className="space-y-3">
                {/* Results Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Available Domains
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.2 text-[11px] font-bold text-blue-800">
                      {availableItems.length}
                    </span>
                  </div>
                  {lastQuery && (
                    <span className="text-xs text-slate-500 truncate max-w-[200px]">
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
              /* Pre-Search Cool Empty State Card */
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center text-slate-400 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700">Ready to search</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Type any keyword, brand name or business idea into the search bar above to begin.
                  </p>
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
