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
      {/* Top Header */}
      <Header
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setIsShortlistOpen(true)}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-start">
          
          {/* ================= LEFT: MINIMAL BRANDING ================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-5">
            
            {/* Live Indicator */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Live Cloudflare DNS</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] leading-[1.15]">
                Find the perfect <span className="text-blue-600">domain</span> for your next venture.
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Real-time availability and live registrar price comparisons. 100% free & open source.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Zap className="h-3.5 w-3.5 text-blue-600" />
                <span>Sub-50ms DNS-over-HTTPS verification</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Tag className="h-3.5 w-3.5 text-emerald-600" />
                <span>Live pricing on Porkbun, Namecheap & GoDaddy</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                <span>100% private — zero search tracking</span>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-slate-700" />
                <span className="text-xs font-medium text-slate-700">Open Source</span>
              </div>
              <a
                href="https://github.com/29Sandesh/domain-hunter"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                <span>Star on GitHub</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

          </div>

          {/* ================= RIGHT: SEARCH & RESULTS ================= */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search Box Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <DomainSearchInput onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Results Section */}
            {hasSearched ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1 text-xs">
                  <span className="font-bold text-slate-800">
                    Available Domains ({availableItems.length})
                  </span>
                  {lastQuery && (
                    <span className="text-slate-400 truncate max-w-[200px]">
                      for &ldquo;{lastQuery}&rdquo;
                    </span>
                  )}
                </div>

                {availableItems.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-2xs">
                    <p className="text-xs font-medium text-slate-700">No available domains found.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try another keyword or select additional extensions above.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
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
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-8 text-center text-slate-400 space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Ready to search</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Type any keyword or startup idea into the search bar above.
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
