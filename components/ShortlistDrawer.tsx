"use client";

import React, { useState } from "react";
import { X, Bookmark, Trash2, Download, ExternalLink, Check, Copy } from "lucide-react";
import { DomainItem } from "./DomainCard";
import { getRegistrarPricing } from "@/lib/checker";

interface ShortlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shortlist: DomainItem[];
  onRemoveItem: (domain: string) => void;
  onClearAll: () => void;
  onUpdateNote: (domain: string, note: string) => void;
  notes: Record<string, string>;
}

export function ShortlistDrawer({
  isOpen,
  onClose,
  shortlist,
  onRemoveItem,
  onClearAll,
  onUpdateNote,
  notes,
}: ShortlistDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [editingDomain, setEditingDomain] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");

  if (!isOpen) return null;

  const handleExportCsv = () => {
    if (shortlist.length === 0) return;
    const header = "Domain,Availability,Notes\n";
    const rows = shortlist
      .map(
        (item) =>
          `"${item.domain}","${item.isAvailable ? "AVAILABLE" : "TAKEN"}","${(notes[item.domain] || "").replace(/"/g, '""')}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `shortlist-domains-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyList = () => {
    const list = shortlist.map((d) => d.domain).join("\n");
    navigator.clipboard.writeText(list);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white p-6 shadow-2xl animate-fade-in">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 fill-amber-500 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Saved Shortlist</h2>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {shortlist.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        {shortlist.length > 0 && (
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex gap-2">
              <button
                onClick={handleCopyList}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>Copy List</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-3 w-3" />
                <span>Export CSV</span>
              </button>
            </div>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-xs text-rose-600 hover:underline"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear</span>
            </button>
          </div>
        )}

        {/* List of items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {shortlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <Bookmark className="h-10 w-10 stroke-1 opacity-40 mb-2" />
              <p className="text-sm font-medium text-slate-600">No saved domains yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                Click the bookmark star on any domain card to save it here for comparison.
              </p>
            </div>
          ) : (
            shortlist.map((item) => {
              const regLinks = getRegistrarPricing(item.domain, item.tld);
              const note = notes[item.domain];
              return (
                <div
                  key={item.domain}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.domain}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                            item.isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {item.isAvailable ? "AVAILABLE" : "TAKEN"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.domain)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Notes box */}
                  <div className="text-xs">
                    {editingDomain === item.domain ? (
                      <div className="space-y-1.5">
                        <textarea
                          value={tempNote}
                          onChange={(e) => setTempNote(e.target.value)}
                          placeholder="Add custom notes..."
                          rows={2}
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingDomain(null)}
                            className="rounded px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              onUpdateNote(item.domain, tempNote);
                              setEditingDomain(null);
                            }}
                            className="rounded bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-blue-700"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingDomain(item.domain);
                          setTempNote(note || "");
                        }}
                        className="cursor-pointer rounded-lg bg-white p-2 border border-slate-200/80 text-[11px] text-slate-600 hover:border-slate-300"
                      >
                        {note ? (
                          <span className="italic text-slate-700">&ldquo;{note}&rdquo;</span>
                        ) : (
                          <span className="text-slate-400">+ Add personal note...</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick Registrar Link */}
                  {item.isAvailable && regLinks[0] && (
                    <a
                      href={regLinks[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      <span>Buy on {regLinks[0].name} ({regLinks[0].price})</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
