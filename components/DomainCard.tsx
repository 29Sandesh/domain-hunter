"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Bookmark,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import { BrandMetrics } from "@/lib/brand-scoring";
import { getRegistrarLinks } from "@/lib/registrar-links";
import { getTldInfo } from "@/lib/tld-data";

export interface DomainItem {
  domain: string;
  name: string;
  tld: string;
  style?: string;
  rationale?: string;
  metrics: BrandMetrics;
  isAvailable?: boolean;
  status?: "AVAILABLE" | "TAKEN" | "PREMIUM" | "PENDING" | "ERROR";
  registrar?: string;
  createdDate?: string;
  expiresDate?: string;
  nameservers?: string[];
  checkTimeMs?: number;
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

  const tldInfo = getTldInfo(item.tld);
  const registrarLinks = getRegistrarLinks(item.domain, item.tld);
  const lowestPrice = registrarLinks[0]?.price || `$${tldInfo?.typicalPriceUsd.toFixed(2) || "10.00"}/yr`;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`group relative flex items-center justify-between rounded-xl border p-4 transition-all duration-150 ${
        item.isAvailable
          ? "border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs"
          : "border-slate-200 bg-slate-50/50 opacity-75"
      }`}
    >
      {/* Domain Name & Info */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {item.name}
              <span className="text-blue-600">{item.tld}</span>
            </span>

            <button
              onClick={handleCopy}
              title="Copy Domain"
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-xs">
            {item.isAvailable ? (
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Available ({lowestPrice})
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400">
                <XCircle className="h-3.5 w-3.5" />
                Taken
              </span>
            )}
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
          className={`rounded-lg border p-2 transition-colors ${
            isShortlisted
              ? "border-amber-300 bg-amber-50 text-amber-600"
              : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-700"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${isShortlisted ? "fill-amber-500 text-amber-500" : ""}`} />
        </button>

        {item.isAvailable ? (
          <div className="relative">
            <div className="flex items-center shadow-2xs rounded-lg overflow-hidden">
              <a
                href={registrarLinks[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-700"
              >
                <span>Buy ({registrarLinks[0].name})</span>
                <span className="text-[11px] font-normal text-blue-100">{registrarLinks[0].price}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="border-l border-blue-500 bg-blue-600 p-2 text-white hover:bg-blue-700"
                title="Compare registrar prices"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Price Comparison Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-30 animate-fade-in">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 mb-1">
                  Registrar Price Comparison:
                </div>
                <div className="space-y-0.5">
                  {registrarLinks.map((reg) => (
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
        ) : (
          <a
            href={registrarLinks[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Lookup
          </a>
        )}
      </div>
    </div>
  );
}
