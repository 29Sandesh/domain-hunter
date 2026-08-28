"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
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
  currency?: "USD" | "INR";
}

export function DomainCard({
  item,
  isShortlisted,
  onToggleShortlist,
  currency = "USD",
}: DomainCardProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const registrars: RegistrarPrice[] = getRegistrarPricing(item.domain, item.tld, currency);
  const lowest = registrars[0] || { name: "Porkbun", price: currency === "INR" ? "₹897/yr" : "$10.37/yr", url: "#" };

  const handleCopy = () => {
    navigator.clipboard.writeText(item.domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 transition-all duration-150 hover:border-blue-300 hover:shadow-xs">
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
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-xs">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Available ({lowest.price})
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Bookmark Button */}
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

        {/* See Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-blue-700"
          >
            <span>See Options</span>
            <span className="text-[11px] font-normal text-blue-100">({lowest.price})</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>

          {/* Price Comparison Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-30 animate-fade-in">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 mb-1 flex items-center justify-between">
                <span>Select Registrar:</span>
                <span>{currency}</span>
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
