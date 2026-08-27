"use client";

import React, { useState } from "react";
import {
  ListChecks,
  Play,
  Download,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { getRegistrarLinks } from "@/lib/registrar-links";
import { DomainCheckResult } from "@/lib/dns-rdap-checker";

export function BulkScanner() {
  const [inputText, setInputText] = useState(
    `chatchaska.com\nmenucraft.io\nleadpulse.ai\ncodemailer.dev\npogoassistant.com\nswigatofood.in\nmonterowerp.com\nnonexistentdomain991823.com\nbrandblast12398.ai`
  );
  const [results, setResults] = useState<DomainCheckResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "available" | "taken">("all");
  const [copied, setCopied] = useState(false);

  const handleStartScan = async () => {
    // Extract domains from text
    const lines = inputText
      .split(/\r?\n/)
      .map((l) => l.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, ""))
      .filter((l) => l.includes(".") && l.length >= 3);

    if (lines.length === 0) return;

    setIsScanning(true);
    try {
      const res = await fetch("/api/domains/bulk-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: lines }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch {
      // Error handling
    } finally {
      setIsScanning(false);
    }
  };

  const availableCount = results.filter((r) => r.isAvailable).length;
  const takenCount = results.filter((r) => !r.isAvailable).length;

  const filteredResults = results.filter((r) => {
    if (filterMode === "available") return r.isAvailable;
    if (filterMode === "taken") return !r.isAvailable;
    return true;
  });

  const handleExportCsv = () => {
    if (results.length === 0) return;
    const header = "Domain,Status,Registrar,CheckTimeMs\n";
    const rows = results
      .map(
        (r) =>
          `"${r.domain}","${r.isAvailable ? "AVAILABLE" : "TAKEN"}","${r.registrar || "N/A"}","${r.checkTimeMs}ms"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `domain-scan-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyAvailable = () => {
    const avail = results.filter((r) => r.isAvailable).map((r) => r.domain).join("\n");
    if (!avail) return;
    navigator.clipboard.writeText(avail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Input Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-blue-600" />
              Bulk Domain List Scanner
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Paste up to 50 domain names (one per line) to instantly verify their live DNS & registry status.
            </p>
          </div>
          {results.length > 0 && (
            <button
              onClick={() => setResults([])}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 hover:text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="mt-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            placeholder="paste domains here, one per line..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-900 p-3 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {inputText.split("\n").filter((l) => l.trim().includes(".")).length} domains detected
          </span>
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Scanning domains...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Start Batch Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Header & Summary */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Stats */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">
                Total: <strong className="text-slate-900">{results.length}</strong>
              </span>
              <span className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> Available: {availableCount}
              </span>
              <span className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600">
                <XCircle className="h-3 w-3" /> Taken: {takenCount}
              </span>
            </div>

            {/* Filter & Export Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                {(["all", "available", "taken"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMode(m)}
                    className={`rounded px-2.5 py-1 text-[11px] font-medium capitalize transition-all ${
                      filterMode === m ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyAvailable}
                disabled={availableCount === 0}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copy Available</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100">
              {filteredResults.map((item) => {
                const regLinks = getRegistrarLinks(item.domain);
                return (
                  <div
                    key={item.domain}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.isAvailable ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-mono text-sm font-bold text-slate-900">{item.domain}</div>
                        {item.registrar && (
                          <div className="text-[11px] text-slate-500">Registrar: {item.registrar}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.checkTimeMs}ms
                      </span>
                      {item.isAvailable ? (
                        <a
                          href={regLinks[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 shadow-2xs"
                        >
                          <span>Buy Domain</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <a
                          href={regLinks[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:text-blue-600"
                        >
                          Lookup
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
