"use client";

import React, { useState } from "react";
import { Search, ArrowRight, Check } from "lucide-react";

interface DomainSearchInputProps {
  onSearch: (params: {
    description: string;
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
      preferredTlds: selectedTlds,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Search Input */}
      <div className="relative flex items-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xs transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10">
        <div className="pl-3 pr-2 text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search brand keywords or startup ideas..."
          className="w-full bg-transparent py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Scanning...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span>Find</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          )}
        </button>
      </div>

      {/* Extension Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-medium text-slate-400 mr-1">Extension:</span>
        {COMMON_TLDS.map(({ tld, label }) => {
          const isSelected = selectedTlds.includes(tld);
          return (
            <button
              key={tld}
              type="button"
              onClick={() => toggleTld(tld)}
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-all ${
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
  );
}
