"use client";

import React, { useState } from "react";
import { Search, Globe, CheckCircle2, XCircle, Clock, ExternalLink, Sparkles, RefreshCw } from "lucide-react";
import { TOP_TLDS } from "@/lib/tld-data";
import { getRegistrarLinks } from "@/lib/registrar-links";
import { DomainItem } from "./DomainCard";

interface MatrixItem {
  tld: string;
  domain: string;
  isAvailable?: boolean;
  status: "AVAILABLE" | "TAKEN" | "CHECKING" | "IDLE";
  price: number;
  registrar?: string;
}

export function TldMatrixView({
  onToggleShortlist,
  shortlistedDomains,
}: {
  onToggleShortlist: (item: DomainItem) => void;
  shortlistedDomains: string[];
}) {
  const [rootName, setRootName] = useState("leadpulse");
  const [matrix, setMatrix] = useState<MatrixItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanMatrix = async (customRoot?: string) => {
    const nameToScan = (customRoot || rootName).trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!nameToScan) return;

    setIsScanning(true);

    const initial: MatrixItem[] = TOP_TLDS.slice(0, 12).map((t) => ({
      tld: t.tld,
      domain: `${nameToScan}${t.tld}`,
      status: "CHECKING",
      price: t.typicalPriceUsd,
    }));
    setMatrix(initial);

    try {
      const domainList = initial.map((item) => item.domain);
      const res = await fetch("/api/domains/bulk-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: domainList }),
      });

      if (res.ok) {
        const data = await res.json();
        const resultsMap = new Map<string, { isAvailable: boolean; status: string; registrar?: string }>();
        for (const r of data.results) {
          resultsMap.set(r.domain.toLowerCase(), r);
        }

        setMatrix((prev) =>
          prev.map((item) => {
            const check = resultsMap.get(item.domain.toLowerCase());
            return {
              ...item,
              isAvailable: check?.isAvailable ?? false,
              status: check?.isAvailable ? "AVAILABLE" : "TAKEN",
              registrar: check?.registrar,
            };
          })
        );
      }
    } catch {
      // Error handling
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Root Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          12-TLD Instant Matrix Scanner
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter any root keyword or brand name to test availability across all top extensions simultaneously.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScanMatrix();
          }}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              placeholder="e.g. codenova, leadpulse, menucraft, pogoai"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <button
            type="submit"
            disabled={isScanning || !rootName.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Scanning 12 TLDs...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Check All Extensions</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Roots */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="text-slate-600 font-medium">Quick tests:</span>
          {["leadpulse", "menucraft", "chatchaska", "devmatch", "voicepogo", "swigato"].map((root) => (
            <button
              key={root}
              type="button"
              onClick={() => {
                setRootName(root);
                handleScanMatrix(root);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 hover:border-slate-300 hover:bg-white"
            >
              {root}
            </button>
          ))}
        </div>
      </div>

      {/* 12-TLD Grid */}
      {matrix.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {matrix.map((item) => {
            const registrarLinks = getRegistrarLinks(item.domain);
            return (
              <div
                key={item.domain}
                className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                  item.isAvailable
                    ? "border-emerald-200 bg-white shadow-sm"
                    : item.status === "CHECKING"
                    ? "border-slate-200 bg-slate-50/70"
                    : "border-slate-200 bg-white/70 opacity-90"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-mono font-bold text-blue-700">
                      {item.tld}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ~${item.price.toFixed(2)}/yr
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-bold text-slate-900 break-all">
                      {item.domain}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {item.status === "CHECKING" ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5 animate-spin text-blue-600" />
                      <span>Checking...</span>
                    </div>
                  ) : item.isAvailable ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Available</span>
                      </div>
                      <a
                        href={registrarLinks[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 shadow-2xs"
                      >
                        <span>Buy Now</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full text-xs">
                      <div className="flex items-center gap-1 text-slate-500">
                        <XCircle className="h-3.5 w-3.5 text-slate-400" />
                        <span>Taken</span>
                      </div>
                      <a
                        href={registrarLinks[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-slate-500 hover:text-blue-600 underline"
                      >
                        Lookup
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
