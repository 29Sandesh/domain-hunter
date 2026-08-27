"use client";

import React, { useState } from "react";
import {
  Bookmark,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import { getRegistrarPricing, RegistrarPrice } from "@/lib/checker";

export interface DomainItem {
  domain: string;
  name: string;
  tld: string;
  style?: string;
  isAvailable?: boolean;
}

interface DomainCardProps {
  item: DomainItem;
  isShortlisted: boolean;
  onToggleShortlist: (item: DomainItem) => void;
}

export function DomainCard({
  item,
  isShortlisted,
  onToggleShortlist,
}: DomainCardProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const registrars: RegistrarPrice[] = getRegistrarPricing(item.domain, item.tld);
  const lowest = registrars[0] || { name: "Porkbun", price: "$10.37/yr", url: "#" };

  const handleCopy = () => {
    navigator.clipboard.writeText(item.domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative flex items-center justify-between rounded-xl border border-slate-200/90 bg-white px-4 py-3 shadow-2xs transition-all duration-150 hover:border-blue-300 hover:shadow-xs">
      {/* Domain Name & Info */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              {item.name}
              <span className="text-blue-600 font-bold">{item.tld}</span>
            </span>

            <button
              onClick={handleCopy}
              title="Copy Domain"
              className="rounded-md p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Available ({lowest.price})
            </span>
            {item.style && (
              <span className="text-slate-400 hidden sm:inline">• {item.style}</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleShortlist(item)}
          title={isShortlisted ? "Saved in Shortlist" : "Save Domain"}
          className={`rounded-lg border p-2 transition-all active:scale-95 ${
            isShortlisted
              ? "border-amber-200 bg-amber-50 text-amber-600"
              : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-700"
          }`}
        >
          <Bookmark className={`h-3.5 w-3.5 ${isShortlisted ? "fill-amber-500 text-amber-500" : ""}`} />
        </button>

        <div className="relative">
          <div className="flex items-center shadow-2xs rounded-lg overflow-hidden border border-blue-600">
            <a
              href={lowest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-blue-700"
            >
              <span>Buy ({lowest.name})</span>
              <span className="text-[11px] font-normal text-blue-100">{lowest.price}</span>
              <ExternalLink className="h-3 w-3 opacity-80" />
            </a>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="border-l border-blue-500 bg-blue-600 p-1.5 text-white hover:bg-blue-700 transition-colors"
              title="Compare registrar prices"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Price Comparison Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-30 animate-fade-in">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 mb-1">
                Compare Registrars:
              </div>
              <div className="space-y-0.5">
                {registrars.map((reg) => (
                  <a
                    key={reg.name}
                    href={reg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{reg.name}</span>
                      {reg.badge && (
                        <span className="rounded bg-emerald-50 px-1 py-0.2 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                          {reg.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-slate-900 text-[11px]">
                        {reg.price}
                      </span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
