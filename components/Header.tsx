"use client";

import React from "react";
import { Bookmark, Github, ArrowUpRight } from "lucide-react";

interface HeaderProps {
  shortlistCount: number;
  onOpenShortlist: () => void;
  currency: "USD" | "INR";
  onToggleCurrency: (currency: "USD" | "INR") => void;
}

export function Header({
  shortlistCount,
  onOpenShortlist,
  currency,
  onToggleCurrency,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Bold Brand Name */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black tracking-tight text-slate-900">
            Domen
          </span>
          <span className="text-xs font-semibold text-slate-400">
            by{" "}
            <a
              href="https://www.linkedin.com/in/sandeshagrawal29/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5"
            >
              Sandesh Agrawal
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Currency Toggle Filter */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 text-xs font-semibold">
            <button
              onClick={() => onToggleCurrency("USD")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                currency === "USD"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => onToggleCurrency("INR")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                currency === "INR"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              INR (₹)
            </button>
          </div>

          {/* Shortlist Button */}
          <button
            onClick={onOpenShortlist}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <Bookmark className="h-3.5 w-3.5 text-slate-500" />
            <span>Shortlist</span>
            {shortlistCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                {shortlistCount}
              </span>
            )}
          </button>

          {/* GitHub Star Button */}
          <a
            href="https://github.com/29Sandesh/domain-hunter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Star Domen on GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
