"use client";

import React from "react";
import { X, HelpCircle, ShieldCheck } from "lucide-react";
import { TOP_TLDS } from "@/lib/tld-data";

interface PricingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingGuideModal({ isOpen, onClose }: PricingGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-fade-in space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">TLD Pricing & Extension Guide</h3>
              <p className="text-xs text-slate-500">
                Industry-standard 1st year registration & renewal benchmarks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Table List */}
        <div className="flex-1 overflow-y-auto pr-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">TLD</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold">Reg Price</th>
                <th className="py-2.5 px-3 font-semibold">Renewal</th>
                <th className="py-2.5 px-3 font-semibold">Best Suited For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {TOP_TLDS.map((tld) => (
                <tr key={tld.tld} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-blue-600">{tld.tld}</span>
                    {tld.badge && (
                      <span className="ml-1.5 rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold text-blue-700 border border-blue-200">
                        {tld.badge}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-500">{tld.category}</td>
                  <td className="py-3 px-3 font-mono font-medium text-emerald-700">
                    ${tld.typicalPriceUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    ${tld.renewalPriceUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px] leading-relaxed">
                    {tld.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Actual registration rates may fluctuate based on registrar promotions.</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
