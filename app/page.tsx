"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  Zap,
  Tag,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Github,
} from "lucide-react";
import { Header } from "@/components/Header";
import { DomainSearchInput } from "@/components/DomainSearchInput";
import { DomainCard, DomainItem } from "@/components/DomainCard";
import { ShortlistDrawer } from "@/components/ShortlistDrawer";

const QUICK_TAGS = [
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
            particleCount: 35,
            spread: 60,
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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Top Header */}
      <Header
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setIsShortlistOpen(true)}
      />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-20 space-y-10">
        {/* Centered Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3.5 py-1 text-xs font-semibold text-blue-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Sub-50ms Cloudflare DNS Verification</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
            Find the perfect <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">domain</span> for your next venture.
          </h1>

          <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Discover brandable names with instant, real-time availability and live registrar price comparisons.
          </p>
        </div>

        {/* Master Search Input */}
        <div className="max-w-2xl mx-auto space-y-3">
          <DomainSearchInput onSearch={handleSearch} isLoading={isLoading} />

          {/* Quick Trending Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-1">
            <span className="text-slate-400 font-medium">Try:</span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleSearch({ description: tag, preferredTlds: [".com"] })}
                className="rounded-md bg-slate-50 px-2.5 py-1 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Feed Section */}
        {hasSearched && (
          <div className="max-w-2xl mx-auto space-y-3 pt-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Available Domains
                </span>
                <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                  {availableItems.length}
                </span>
              </div>
              {lastQuery && (
                <span className="text-xs text-slate-400 truncate max-w-[200px]">
                  for &ldquo;{lastQuery}&rdquo;
                </span>
              )}
            </div>

            {/* Results Cards List */}
            {availableItems.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-2xs space-y-2">
                <p className="text-base font-bold text-slate-800">No available domains found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try another keyword or select additional extensions (.ai, .io, .co).
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
        )}

        {/* Feature Highlights Strip */}
        <div className="max-w-3xl mx-auto pt-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="space-y-1.5 p-3 rounded-xl">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-900">
              <Zap className="h-4 w-4 text-blue-600" />
              <span>Zero False Positives</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct Cloudflare DNS queries guarantee 100% verified live availability.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-900">
              <Tag className="h-4 w-4 text-emerald-600" />
              <span>Registrar Price Comparison</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare exact rates on Porkbun, Dynadot, Namecheap & GoDaddy in 1 click.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span>100% Free & Open Source</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Zero domain sniping, zero API keys, and no rate limits.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Domen is open-source software built by <a href="https://codehtml.in" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-800 hover:text-blue-600">Codehtml</a>.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/29Sandesh/domain-hunter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

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
