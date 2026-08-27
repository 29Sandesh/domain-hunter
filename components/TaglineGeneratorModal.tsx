"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles, Copy, Check, Palette, Target, Lightbulb } from "lucide-react";
import { DomainItem } from "./DomainCard";

interface TaglineModalProps {
  item: DomainItem | null;
  onClose: () => void;
}

interface TaglineData {
  domain: string;
  brandName: string;
  taglines: string[];
  elevatorPitch: string;
  brandPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function TaglineGeneratorModal({ item, onClose }: TaglineModalProps) {
  const [data, setData] = useState<TaglineData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!item) return;

    setIsLoading(true);
    fetch("/api/domains/taglines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain: item.domain,
        brandName: item.name,
        category: item.style || "technology SaaS",
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [item]);

  if (!item) return null;

  const handleCopyTagline = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-fade-in space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">AI Brand Pitch & Taglines</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Brand Banner */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs text-slate-500">Selected Domain:</div>
          <div className="font-mono text-base font-bold text-blue-600">{item.domain}</div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-2" />
            <span className="text-xs">Crafting compelling brand taglines & pitch...</span>
          </div>
        ) : data ? (
          <div className="space-y-4 text-xs">
            {/* Taglines */}
            <div>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span>3 High-Converting Taglines:</span>
              </div>
              <div className="space-y-2">
                {data.taglines.map((tagline, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-slate-800"
                  >
                    <span className="font-medium italic pr-2">&ldquo;{tagline}&rdquo;</span>
                    <button
                      onClick={() => handleCopyTagline(tagline, idx)}
                      className="rounded p-1 text-slate-400 hover:text-slate-700"
                    >
                      {copiedIndex === idx ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Elevator Pitch */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span>Elevator Pitch:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{data.elevatorPitch}</p>
            </div>

            {/* Brand Colors */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-2">
                <Palette className="h-4 w-4 text-emerald-600" />
                <span>Recommended Brand Color Palette:</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-5 w-5 rounded-full border border-slate-300"
                    style={{ backgroundColor: data.brandPalette.primary }}
                  />
                  <span className="text-[11px] font-mono text-slate-500">Primary</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-5 w-5 rounded-full border border-slate-300"
                    style={{ backgroundColor: data.brandPalette.secondary }}
                  />
                  <span className="text-[11px] font-mono text-slate-500">Accent 1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-5 w-5 rounded-full border border-slate-300"
                    style={{ backgroundColor: data.brandPalette.accent }}
                  />
                  <span className="text-[11px] font-mono text-slate-500">Accent 2</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
