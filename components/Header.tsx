"use client";

import React from "react";
import { Bookmark, Github } from "lucide-react";
import { DomenLogo } from "./DomenLogo";

interface HeaderProps {
  shortlistCount: number;
  onOpenShortlist: () => void;
}

export function Header({
  shortlistCount,
  onOpenShortlist,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <DomenLogo size={34} />
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black tracking-tight text-slate-900">
              Domen
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              by <a href="https://codehtml.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Codehtml</a>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
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
