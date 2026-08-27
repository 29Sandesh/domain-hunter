"use client";

import React, { useEffect, useState } from "react";
import { X, AtSign, CheckCircle2, XCircle, Clock, ExternalLink, HelpCircle } from "lucide-react";
import { DomainItem } from "./DomainCard";

interface SocialCheckModalProps {
  item: DomainItem | null;
  onClose: () => void;
}

interface SocialPlatform {
  platform: string;
  handle: string;
  url: string;
  isAvailable: boolean | null;
  checked: boolean;
}

export function SocialCheckModal({ item, onClose }: SocialCheckModalProps) {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!item) return;

    setIsLoading(true);
    fetch(`/api/domains/social?handle=${encodeURIComponent(item.name)}`)
      .then((res) => res.json())
      .then((data) => {
        setPlatforms(data.platforms || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-fade-in space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AtSign className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Social Handle Availability</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Username Root */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs text-slate-500">Target Username Handle:</div>
          <div className="font-mono text-base font-bold text-blue-600">@{item.name}</div>
        </div>

        {/* Platform List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate-500">
            <Clock className="h-6 w-6 animate-spin text-blue-600 mb-2" />
            <span className="text-xs">Scanning social handles...</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {platforms.map((plat) => (
              <div
                key={plat.platform}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="text-xs font-semibold text-slate-900">{plat.platform}</div>
                  <span className="font-mono text-[11px] text-slate-500">{plat.handle}</span>
                </div>

                <div className="flex items-center gap-3">
                  {plat.checked ? (
                    plat.isAvailable ? (
                      <span className="flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                        <XCircle className="h-3 w-3" /> Taken
                      </span>
                    )
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <HelpCircle className="h-3 w-3" /> Click to view
                    </span>
                  )}

                  <a
                    href={plat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded p-1 text-slate-400 hover:text-blue-600"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
