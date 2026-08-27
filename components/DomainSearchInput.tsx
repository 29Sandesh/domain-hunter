"use client";

import React, { useState } from "react";
import { Search, ArrowRight, Check } from "lucide-react";

interface DomainSearchInputProps {
  onSearch: (params: {
    description: string;
    keywords: string[];
    styles: string[];
    preferredTlds: string[];
  }) => void;
  isLoading: boolean;
}

const COMMON_TLDS = [
  { tld: ".com", label: ".com" },
  { tld: ".ai", label: ".ai" },
  { tld: ".io", label: ".io" },
  { tld: ".co", label: ".co" },
  { tld: ".app", label: ".app" },
  { tld: ".dev", label: ".dev" },
  { tld: ".in", label: ".in" },
];

export function DomainSearchInput({ onSearch, isLoading }: DomainSearchInputProps) {
  const [query, setQuery] = useState("");
  const [selectedTlds, setSelectedTlds] = useState<string[]>([".com"]);

  const toggleTld = (tld: string) => {
    if (selectedTlds.includes(tld)) {
      if (selectedTlds.length > 1) {
        setSelectedTlds(selectedTlds.filter((t) => t !== tld));
      }
    } else {
      setSelectedTlds([...selectedTlds, tld]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    onSearch({
      description: query.trim(),
      keywords: [],
      styles: ["Compound", "Brandable / Abstract", "Affix & Action", "Tech & AI"],
      preferredTlds: selectedTlds,
    });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main Search Input */}
        <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
          <div className="pl-3.5 pr-2 text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, brand names or describe what you are building..."
            className="w-full bg-transparent py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Finding...</span>
              </>
            ) : (
              <>
                <span>Find Domains</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>

        {/* TLD Selector Chips */}
        <div className="flex flex-wrap items-center gap-1.5 px-1">
          <span className="text-xs font-medium text-slate-400 mr-1">Extension:</span>
          {COMMON_TLDS.map(({ tld, label }) => {
            const isSelected = selectedTlds.includes(tld);
            return (
              <button
                key={tld}
                type="button"
                onClick={() => toggleTld(tld)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white font-semibold shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {isSelected && <Check className="h-3 w-3" />}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
}
