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
  Copy,
  Check,
  Terminal,
} from "lucide-react";
import { Header } from "@/components/Header";
import { DomainSearchInput } from "@/components/DomainSearchInput";
import { DomainCard, DomainItem } from "@/components/DomainCard";
import { ShortlistDrawer } from "@/components/ShortlistDrawer";

export default function DomenApp() {
  const [domainItems, setDomainItems] = useState<DomainItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [copiedInstall, setCopiedInstall] = useState(false);

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

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("npx degit 29Sandesh/domain-hunter domen && cd domen && npm i && npm run dev");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
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
            spread: 45,
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
      {/* Top Navigation */}
      <Header
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setIsShortlistOpen(true)}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: HERO & BRANDING (SPACED & BALANCED) ================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
            
            {/* Live Indicator Chip */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
              </span>
              <span>Sub-50ms DNS-over-HTTPS Engine</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-black tracking-tight text-slate-900 leading-[1.08]">
                Find the perfect <span className="text-blue-600">domain</span> for your next venture.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Enter your startup idea or keywords. Domen derives high-recall naming combinations and verifies live registry availability in milliseconds.
              </p>
            </div>

            {/* Feature Cards Matrix */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">Zero False Positives</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Direct Cloudflare & Google DNS queries verify 100% live availability.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">Live Registrar Price Comparison</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Compare real-time rates on Porkbun, Dynadot, Namecheap & GoDaddy in 1 click.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">100% Private & Open Source</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Zero domain front-running, no subscriptions, and zero API keys needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick 1-Command Terminal Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Terminal className="h-3.5 w-3.5 text-blue-600" />
                  <span>1-Command Quickstart</span>
                </div>
                <button
                  onClick={handleCopyInstall}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  {copiedInstall ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedInstall ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <div className="rounded-xl bg-slate-900 px-3 py-2 font-mono text-[11px] text-slate-200 truncate">
                <span className="text-emerald-400">$</span> npx degit 29Sandesh/domain-hunter domen
              </div>
            </div>

            {/* GitHub Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-3.5 flex items-center justify-between">
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

          {/* ================= RIGHT COLUMN: SEARCH & STREAM ================= */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Search Input Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <DomainSearchInput onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Results Section */}
            {hasSearched ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      Available Domains
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800">
                      {availableItems.length}
                    </span>
                  </div>
                  {lastQuery && (
                    <span className="text-slate-400 truncate max-w-[200px]">
                      for &ldquo;{lastQuery}&rdquo;
                    </span>
                  )}
                </div>

                {availableItems.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-2xs space-y-1.5">
                    <p className="text-sm font-semibold text-slate-800">No available domains found for this keyword.</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
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
              /* Minimal Empty State */
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-12 text-center text-slate-400 space-y-2.5">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Ready to search</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Type any keyword, brand name or startup idea in the search bar above.
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
