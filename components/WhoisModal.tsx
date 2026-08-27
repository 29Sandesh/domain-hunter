"use client";

import React, { useEffect, useState } from "react";
import { X, Shield, Clock, Server, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { DomainItem } from "./DomainCard";

interface WhoisModalProps {
  item: DomainItem | null;
  onClose: () => void;
}

interface WhoisData {
  domain: string;
  availability: boolean;
  status: string;
  registrar: string;
  createdDate: string;
  expiresDate: string;
  nameservers: string[];
  dnsRecords: Record<string, string[]>;
}

export function WhoisModal({ item, onClose }: WhoisModalProps) {
  const [data, setData] = useState<WhoisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!item) return;

    setIsLoading(true);
    fetch(`/api/domains/whois?domain=${encodeURIComponent(item.domain)}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-fade-in space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">WHOIS & DNS Intelligence</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Domain Bar */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div>
            <span className="font-mono text-base font-bold text-slate-900">{item.domain}</span>
            <div className="text-[11px] text-slate-500">ICANN Registry / RDAP Query</div>
          </div>
          {item.isAvailable ? (
            <span className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" /> AVAILABLE
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-lg bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700">
              <XCircle className="h-3.5 w-3.5" /> REGISTERED
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <Clock className="h-6 w-6 animate-spin text-blue-600 mb-2" />
            <span className="text-xs">Fetching authoritative DNS & WHOIS records...</span>
          </div>
        ) : data ? (
          <div className="space-y-4 text-xs">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Server className="h-3.5 w-3.5 text-blue-600" />
                  <span>Registrar</span>
                </div>
                <div className="font-medium text-slate-900 break-words">{data.registrar}</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  <span>Timeline</span>
                </div>
                <div className="text-slate-700">
                  Created: <strong className="text-slate-900">{data.createdDate}</strong>
                </div>
                <div className="text-slate-700">
                  Expires: <strong className="text-slate-900">{data.expiresDate}</strong>
                </div>
              </div>
            </div>

            {/* Nameservers */}
            {data.nameservers && data.nameservers.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                <div className="text-slate-700 mb-1.5 font-semibold">Active Nameservers:</div>
                <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                  {data.nameservers.map((ns) => (
                    <span
                      key={ns}
                      className="rounded bg-white px-2 py-0.5 text-blue-700 border border-slate-200"
                    >
                      {ns}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* DNS Records */}
            {data.dnsRecords && Object.keys(data.dnsRecords).length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                <div className="text-slate-700 mb-1.5 font-semibold">DNS Zone Records:</div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto font-mono text-[11px]">
                  {Object.entries(data.dnsRecords).map(([type, vals]) => (
                    <div key={type} className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[40px]">{type}:</span>
                      <span className="text-slate-700 truncate">{vals.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
