"use client";

import React, { useState } from "react";
import { Search, ArrowRight, Check } from "lucide-react";

interface DomainSearchInputProps {
  onSearch: (params: {
    description: string;
    preferredTlds: string[];
  }) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const EXTENSIONS = [
  { tld: ".com", label: ".com" },
  { tld: ".ai", label: ".ai" },
  { tld: ".io", label: ".io" },
  { tld: ".co", label: ".co" },
  { tld: ".app", label: ".app" },
  { tld: ".dev", label: ".dev" },
  { tld: ".in", label: ".in" },
];

export function DomainSearchInput({
  onSearch,
  isLoading,
  initialQuery = "",
}: DomainSearchInputProps) {
  const [query, setQuery] = useState(initialQuery);
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
      preferredTlds: selectedTlds,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Master Search Input Bar */}
      <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-slate-300">
        <div className="pl-3.5 pr-2 text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you building? e.g. Lead gen SaaS, offline POS, voice assistant..."
          className="w-full bg-transparent py-2.5 text-base text-slate-900 placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-98 disabled:opacity-40 shrink-0"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <span>Find Domains</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Extension Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold text-slate-400 mr-1 uppercase tracking-wider">
          Filter:
        </span>
        {EXTENSIONS.map(({ tld, label }) => {
          const isSelected = selectedTlds.includes(tld);
          return (
            <button
              key={tld}
              type="button"
              onClick={() => toggleTld(tld)}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {isSelected && <Check className="h-3.5 w-3.5" />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </form>
  );
}
