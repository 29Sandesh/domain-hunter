"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  Github,
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
      {/* Top Navigation */}
      <Header
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setIsShortlistOpen(true)}
      />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-start">
          
          {/* ================= LEFT COLUMN: CLEAN & MINIMAL ================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* Large Bold DOMEN by Sandesh Agrawal Byline */}
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 flex items-baseline gap-3">
                <span>DOMEN</span>
                <span className="font-normal text-slate-400 text-sm sm:text-base tracking-normal">
                  by{" "}
                  <a
                    href="https://www.linkedin.com/in/sandeshagrawal29/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5"
                  >
                    Sandesh Agrawal
                    <ArrowUpRight className="h-4 w-4 text-blue-600 inline" />
                  </a>
                </span>
              </div>
            </div>

            {/* 1. Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-slate-800 leading-[1.12]">
              Find the perfect <span className="text-blue-600">domain</span> for your next venture.
            </h1>

            {/* 2. Subheading */}
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-md">
              Real-time availability and live registrar price comparisons. 100% free and open source.
            </p>

            {/* 3. GitHub Link */}
            <div className="pt-2">
              <a
                href="https://github.com/29Sandesh/domain-hunter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <Github className="h-4 w-4" />
                <span>Open Source on GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: SEARCH & STREAM ================= */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Search Input Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <DomainSearchInput
                onSearch={handleSearch}
                isLoading={isLoading}
              />
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
                    <p className="text-sm font-semibold text-slate-800">No short domains available for this exact query.</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try selecting additional extensions above (.ai, .io, .co) or enter a broader concept.
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
              /* Clean Minimal Discovery Box */
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs space-y-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Domain Discovery Engine
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                  Enter any keyword, brand concept, or describe what you are building to scan live registry availability across Porkbun, Namecheap, and GoDaddy in real time.
                </p>
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
